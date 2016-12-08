var express = require('express');
var app = express();
var cheerio = require('cheerio');
var superagent = require('superagent');
var fs = require('fs');
var http = require('http');
var item = [];
var item1 = [];
var data = [];
var onceMysql = 1;
var loop;
var flag;
var flagMysql;
var system=false;
var action = 'https://www.zao28.com/xy28';
var mysql = require('mysql');

function selectMysql(obj) {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'assinsass',
        database: 'luck'
    });
    connection.connect();
    var select = 'SELECT *FROM CATHECTIC WHERE id=?';
    var id = [];
    id[0] = obj[0];
    connection.query(select, id, function(err, rows, fields) {
        if (err) {
            throw err.message;
        }
        onceMysql = 2;
        if (rows.length == 0) {
            console.log('没有该条数据');
            insertMysql(data);
            return true;
        } else {
             // setSystem([0,0]);
            console.log('有该条数据');
             // setSystem([0,0]);
            return false;
        }
    })
    connection.end();
}

function insertMysql(obj) {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'assinsass',
        database: 'luck'
    });
    connection.connect();
    var insert = 'INSERT INTO CATHECTIC (id,num,result,created_at)values(?,?,?,?)';
    connection.query(insert, obj, function(err, rows, fields) {
        if (err) {
            throw err.message;
        }
    })
    connection.end();
}
function setSystem(obj){
     var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'assinsass',
        database: 'luck'
    });
    connection.connect();
    var insert = 'UPDATE  SYSTEM set updateNum=?,updatePoints=? WHERE id=0';
    connection.query(insert, obj, function(err, rows, fields) {
        if (err) {
            throw err.message;
        }
    })
    connection.end();
    system=true;
};
function circulation(n) {
    if (!flag) {
        loop = setInterval(function() {
            getNum(action);
        }, n)
        flag = true;
    }
}

function getNum() {
    try {
        console.log("第二次爬取开奖");
        superagent.get(action).end(function(err, sres, next) {
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
            if(!system){
                    setSystem([1,0]);    
                    console.log('系统占用');
            }
            if (item[0] == item1[0]) {
                circulation(5000);
            } else {
                clearInterval(loop);
                data[0] = item1[0];
                data[1] = item1[2];
                if (item1[3] >= 13) {
                    data[2] = '大';
                } else {
                    data[2] = '小';
                }
                if (item1[3] % 2 == 0) {

                    data[2] += '-双';
                } else {
                    data[2] += '-单';
                }
                console.log(item1[3] % 2);
                console.log(item1[3] % 2 == 0);
                data[2] += '-操' + item1[3];
                console.log('item1[3]' + item1[3]);
                data[3] = item1[1];
                console.log(data);
                insertMysql(data);
                setSystem([0,0]);
                loop = null;
                s = setTimeout(function() {
                    get();
                }, 2000);
            }
        });
    } catch (e) {
        console.log(e.message);
        getNum();
    }
}
var get = function() {
    try {
        superagent.get(action).end(function(err, sres, next) {
            if (err) {
                return next(err);
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
            if (item1[3] % 2 == 0) {
                data[2] += '-双';
            } else {
                data[2] += '-单';
            }
            data[2] += '-操' + item[3];
            // data[2] = item[3];
            data[3] = item[1];
            var miunt = $('#opentime .time').text();
            miunt = (miunt * 1000) + 2000;
            if (onceMysql == 1) {
                selectMysql(data);
            }
        
            console.log(miunt)
            s = setTimeout(function() {
                flag = false;
                
                getNum();
            }, miunt);
            //     //   fs.writeFile('data.txt',sres.text, function(err) {
            //     //   if (err) {
            //     //       return console.error(err);
            //     //   }
            //     //   console.log("写入成功");
            //     // })
        });
    } catch (e) {
        console.log(e.message);
        get();
    }
}
var setInt = function() {
    //setInterval(get,2000,'https://cnodejs.org/');
    // get('http://www.pc28.am/')
    // get('http://www.pceggs.com/')
    get(action)
        // get('http://www.28shence.com/xxw.php?3.1.1')
        // get('https://cnodejs.org/');
        // get('http://dandan28.com/mobile.php');
}
exports.setint = setInt;
