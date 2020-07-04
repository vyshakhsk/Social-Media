const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const path = require('path');
const User = require('../../models/User');
const config = require('config');
const jwt = require('jsonwebtoken');
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

router.post('/upload', upload.single('file'), (req, res) => {
  res.json({ file: req.file });
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

//Register User
router.post(
  '/',
  [
    /*check('name', 'Name is req').not().isEmpty(),
    check('email', 'Is email').isEmail(),
    check('password', 'Enter pass with 6 or more').isLength({ min: 6 }),*/
    upload.single('file'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      //User Exists
      if (user) {
        return res.status(400).json({ error: [{ msg: 'User exists' }] });
      }
      //Get gravatar
      const file = req.file.filename;
      const avatar = file;
      //'https://image.shutterstock.com/image-vector/profile-placeholder-image-...';

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      //Encrypt pass
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //Return JWT
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtsecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
