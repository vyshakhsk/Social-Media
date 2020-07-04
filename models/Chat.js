const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  message: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = Chat = mongoose.model('chat', ChatSchema);
