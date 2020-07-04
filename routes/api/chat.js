const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Chat = require('../../models/Chat');

router.post('/add', auth, async (req, res) => {
  try {
    const newchat = new Chat({
      from: req.user.id,
      to: req.body.to,
      message: req.body.message,
    });
    const chat = await newchat.save();
    res.json(chat);
  } catch (err) {
    console.error(err.message);
    if (err.name == 'CastError') {
      return res.status(400).json({ msg: 'There is no such post' });
    }
    res.status(500).send('Server Error');
  }
});

router.get('/:to', auth, async (req, res) => {
  try {
    const chats = await Chat.find({
      $or: [
        { from: req.user.id, to: req.params.to },
        { from: req.params.to, to: req.user.id },
      ],
    }).sort({ date: 1 });

    res.json(chats);
  } catch (err) {
    console.error(err.message);
    if (err.name == 'CastError') {
      return res.status(400).json({ msg: 'There is no such post' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
