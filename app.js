var express = require('express');
var app = express();
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
                console.log('更新积分比较'+re);
                console.log(data[2]);
                if (data[2].match(new RegExp(re.action))) {
                    var point = re.money * re.multiple;
                    setMysql.setmysql.setPoints([point, re.name]);
                }else{
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
        if (!system) {
            setMysql.setmysql.setSystem([1, 0]);
            console.log('系统占用');
        }
        if (item[0] == item1[0]) {
            console.log('数据一样');
            circulation(5000);
        } else {
            console.log('清除定时');
            clearInterval(loop);
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
            console.log('更新积分');
            updateMysql();
            MQ.setSystem([0, 0]);
            system = false;
            loop = null;
            s = setTimeout(function() {
                get();
            }, 10000);
        }
    });
}
var get = function() {
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
        miunt = (miunt * 1000) + 2000;
        if (onceMysql == 1) {
            updateMysql()
        }
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