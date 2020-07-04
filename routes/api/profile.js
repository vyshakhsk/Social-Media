const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const request = require('request');
const config = require('config');
const crypto = require('crypto');
const path = require('path');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
fs = require('fs-extra');
const MongoClient = require('mongodb').MongoClient;

ObjectId = require('mongodb').ObjectId;
// DB
const mongoURI =
  'mongodb+srv://vyas1709:vyas1709@cluster0-n7tzh.mongodb.net/test?retryWrites=true&w=majority';

const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// init gfs
let gfs;
conn.once('open', () => {
  // init stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads',
  });
});

// Storage
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({
  storage,
});

//Get current users profile
//private access
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//POst -- Create or update user profile -- private access
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    //Build profile obj
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }

    //BUild Social obj
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      //Create

      profile = new Profile(profileFields);
      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

//Get all profiles -- public access
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//Get specific profiles -- public access
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no such profile' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.name == 'CastError') {
      return res.status(400).json({ msg: 'There is no such profile' });
    }
    res.status(500).send('Server Error');
  }
});

//Delete --- profile, user, post
router.delete('/', auth, async (req, res) => {
  try {
    await Post.deleteMany({ user: req.user.id });
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//Send Friend Request
router.put('/sendreq/:id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const friend = await Profile.findOne({ user: req.params.id });
    const user = await User.findById(req.user.id).select('-password');

    const newSendreq = {
      userId: req.params.id,
    };
    const newRequest = {
      userId: req.user.id,
      username: user.name,
    };
    const ch = friend.request
      .map((item) => {
        return item.userId;
      })
      .indexOf(req.user.id);
    if (ch != -1) {
      return res.status(400).json({ error: [{ msg: 'Request exists' }] });
    }

    const ch1 = friend.friendsList
      .map((item) => {
        return item.friendId;
      })
      .indexOf(req.user.id);
    if (ch1 != -1) {
      return res.status(400).json({ error: [{ msg: 'Friend exists' }] });
    }

    profile.sentRequest.unshift(newSendreq);
    await profile.save();

    friend.request.unshift(newRequest);
    await friend.save();

    res.json(friend.request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//Add friend
router.put('/addfriend/:request_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const user = await User.findById(req.user.id).select('-password');

    const ch = profile.request
      .map((item) => {
        return item._id;
      })
      .indexOf(req.params.request_id);
    const retrive = profile.request[ch];

    const newFriend = {
      friendId: retrive.userId,
      friendName: retrive.username,
    };

    const friend = await Profile.findOne({ user: retrive.userId });

    profile.friendsList.unshift(newFriend);
    profile.request.splice(ch, 1);

    const removeIndex1 = friend.sentRequest
      .map((item) => {
        return item.userId;
      })
      .indexOf(req.user.id);
    friend.sentRequest.splice(removeIndex1, 1);

    const newFriend1 = {
      friendId: req.user.id,
      friendName: user.name,
    };
    friend.friendsList.unshift(newFriend1);

    await profile.save();
    await friend.save();

    res.json(profile.friendsList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/uploadStory', [auth, upload.single('file')], async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id });
  const file = req.file.filename;
  console.log(file);
  profile.story = file;
  await profile.save();
  res.json(profile);
});

router.get('/image/:filename', (req, res) => {
  // console.log('id', req.params.id)
  const file = gfs
    .find({
      filename: req.params.filename,
    })
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'no files exist',
        });
      }
      gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    });
});

module.exports = router;
