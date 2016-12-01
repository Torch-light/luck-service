/*
* @Author: Weetao
* @Date:   2016-11-26 15:38:53
* @Last Modified by:   Weetao
* @Last Modified time: 2016-11-26 15:54:18
*/

// 'use strict';

// var http=require('http');
  
// var qs = require('querystring');  
  
// var data = {  
//     _: new Date().getTime()
//  };//这是需要提交的数据  
  
  
// var content = qs.stringify(data);  
//   console.log(content)
// var options = {  
    
//     method: 'GET'  
// };  
  
// var req = http.request(options, function (res) {  
// 	console.log(res);
//     res.setEncoding('utf8');  
//     res.on('data', function (chunk) {  
//         console.log('BODY: ' + chunk);  
//     });  
// });  
  
// req.on('error', function (e) {  
//     console.log('problem with request: ' + e.message);  
// });  
  
// req.end();  

var http = require('http');
var querystring = require('querystring');
var options = {
        host:'https://www.zao28.com/xy28/getnowtime?_=1480145825538', // 具体路径, 必须以'/'开头, 是相对于host而言的
        method: 'GET', // 请求方式, 这里以post为例
        headers: { // 必选信息, 如果不知道哪些信息是必须的, 建议用抓包工具看一下, 都写上也无妨...
            'Content-Type': 'application/json'
        }
    };
    http.get(options, function(res) {
        var resData = "";
        res.on("data",function(data){
            resData += data;
        });
        res.on("end", function() {
            callback(null,JSON.parse(resData));
        });
    })