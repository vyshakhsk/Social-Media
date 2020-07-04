const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

var _db;
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('Connected');
    _db = conn.db;
    return conn;
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const getdb = () => {
  return _db;
};

module.exports = { connectDB, getdb };
