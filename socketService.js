var app = require('http').createServer(handler);
var io = require('socket.io')(app);

var Redis = require('ioredis');
var redis = new Redis();

app.listen(8805, function () {
  console.log('Server is running!') ;
});

function handler(req, res) {
  res.writeHead(200);
  res.end('');
}

io.on('connection', function (socket) {
  socket.on('message', function (message) {
    console.log('isssmessage')
  })
  socket.on('disconnect', function () {
    console.log('user disconnect')
  })
});


redis.psubscribe('ac*', function (err, count) {
	console.log('监听ac');
});

redis.psubscribe('re*', function (err, count) {
  console.log('监听re');
});

redis.on('pmessage', function (subscrbed, channel, message) {
  message = JSON.parse(message);
  if(subscrbed.match(/ac/)){
   io.emit(channel,message.data.user);
   io.emit('action-0',message.data.user);
  }
  if(subscrbed.match(/re/)){
    console.log(channel);
    io.emit(channel,message.data);
    io.emit('rechange-0',message.data.message);
  }
});