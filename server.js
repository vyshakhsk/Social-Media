const express = require('express');
const { connectDB } = require('./config/db');
const io = require('socket.io')();

const app = express();

let conn = connectDB();

exports.getConn = () => {
  return conn.then(function (result) {
    console.log(result);
    return 'ere';
  });
};

app.use(express.json({ extendend: false }));

app.get('/', (req, res) => res.send('Running'));

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/chat', require('./routes/api/chat'));

var clients = {};

io.on('connection', (client) => {
  client.on('add-user', function (data) {
    clients[data.userId] = {
      socket: client.id,
    };
    console.log(clients);
  });

  client.on('send-message', function (chat) {
    const to = chat.to;
    chat.date = Date.now();

    if (clients[to]) {
      console.log(chat);
      io.to(clients[to].socket).emit('rec-message', chat);
    }
  });
  client.on('rec-message', function (chat) {
    console.log(chat);
  });
});

const PORT = process.env.PORT || 5000;
io.listen(4000);
console.log('listening on port ', 4000);
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
