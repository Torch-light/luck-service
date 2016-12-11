var express = require('express');
var cheerio = require('cheerio');
var superagent = require('superagent');
var async = require('async')
var fs = require('fs');
var http = require('http');
var item = [];
var item1 = [];
var data = [];
var sqlItem = [];
var onceMysql = 1;
var loop;
var flag;
var flagMysql;
var system = false;
var action = 'https://www.zao28.com/xy28';
var setMysql = require('./setMysql');
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
function circulation(n) {
    if (!flag) {
        loop = setInterval(function() {
            getNum(action);
        }, n)
        flag = true;
    }
}

function updateMysql() {
    async.waterfall([
        function(callback) {
            MQ.selectMysql(data, function(result) {
                console.log('更新1');
                callback(null, result);
            });
        },
        function(arg1, callback) {
            MQ.insertMysql(arg1, function(result) {
                console.log('更新2');
                callback(null, result);
            });
        },
        function(arg1, callback) {
            MQ.getaction(data[0], function(result) {
                console.log('更新3');
                console.log(result);
                callback(null, result);
            });
        },
        function(arg1, callback) {
            arg1.forEach(function(re) {
                console.log('更新4');
                console.log('更新积分比较' + re);
                console.log(data[2]);
                if (data[2].match(new RegExp(re.action))) {
                    var point = re.money * re.multiple;
                    MQ.setAction([1, re.id]);
                    MQ.setPoints([point, re.name]);
                } else {
                    console.log('没有相同的');
                }
            });
        }
    ], function(err) {
        if (err) {
            console.log(err);
        }
        // result now equals 'done'
        console.log('结束');
    });
}

function getNum() {
    console.log("第二次爬取开奖");
    superagent.get(action).end(function(err, sres, next) {
        if (err) {
            setTimeout(function() {
                get();
            }, 2000);
            return false;
        }
        item1 = [];
        var $ = cheerio.load(sres.text);
        var qh = $('#data-listbody tr').eq(1);
        $(qh).children().each(function(i, e) {
            if (i != 2) {
                item1.push($(e).text())
            } else {
                item1.push($(e).text());
                item1.push($(e).children().text())
            };
        });
        console.log('itm1' + item1[0]);
        console.log('itm' + item[0]);
        if (!system) {
            MQ.setSystem([1, 0]);
            system = true;
            console.log('系统占用');
        }
        if (item[0] == item1[0]) {
            if (!flag) {
                circulation(5000);
                flag = true;
            }
           
        } else {
            system = false;
            
            if(loop){
                console.log('清除定时器');
            clearInterval(loop);
            }
            data[0] = item1[0];
            data[1] = item1[2];
            if (item1[3] >= 13) {
                data[2] = '大';
            } else {
                data[2] = '小';
            }
            if (item1[3] % 2 == 0) {
                data[2] += '双';
            } else {
                data[2] += '单';
            }
            data[2] += '操' + item1[3];
            data[3] = item1[1];
            updateMysql();
            system = false;
            loop = null;
            MQ.setSystem([0, 0]);
            s = setTimeout(function() {
            console.log('loop'+loop);
                get();
            }, 8000);
        }
    });
}
var get = function() {
    console.log('第一次爬取数据');
    MQ.setSystem([0, 0]);
    superagent.get(action).end(function(err, sres, next) {
        if (err) {
            setTimeout(function() {
                get();
            }, 2000);
            return false;
        }
        item = [];
        var $ = cheerio.load(sres.text);
        var qh = $('#data-listbody tr').eq(1);
        $(qh).children().each(function(i, e) {
            if (i != 2) {
                item.push($(e).text())
            } else {
                item.push($(e).text());
                item.push($(e).children().text())
            };
        });
        data[0] = item[0];
        data[1] = item[2];
        if (item[3] >= 13) {
            data[2] = '大';
        } else {
            data[2] = '小';
        }
        if ((item[3] % 2) == 0) {
            data[2] += '双';
        } else {
            data[2] += '单';
        }
        data[2] += '操' + item[3];
        // data[2] = item[3];
        data[3] = item[1];
        var miunt = $('#opentime .time').text();
        console.log('item[0]'+item[0])
        miunt = (miunt * 1000) + 2000;
        if (onceMysql == 1) {
            onceMysql++;
            console.log('第一次执行，更新积分');
            updateMysql()
        }
        console.log(miunt+'秒后执行第二次');
        s = setTimeout(function() {
            flag = false;
            getNum();
        }, miunt);
    });
}
var setInt = function() {
    MQ = setMysql.setmysql;
    MQ.start();
    get(action)
}
exports.setint = setInt;