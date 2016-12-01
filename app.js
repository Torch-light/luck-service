var express = require('express');
var app = express();
var cheerio = require('cheerio');
var superagent = require('superagent');
var fs = require('fs');
var http = require('http');
var n = 0;
var item = [];
var data = [];
var t;
var miunt=1000;
function getNum(action) {
    console.log("爬取开奖");
    // superagent.get(action)
    // // console.log('13213213')
    // 	.end(function (err,sres,next) {
    // 		if (err) {
    // 			return next(err);
    // 		}
    // 		 var $=cheerio.load(sres.text);
    // 		// $('.data-listbody').eq(1).text();
    // 		// console.log($('.datalist').eq(1).text());
    // 		var qh=$('#data-listbody tr').eq(1).text();
    // 		console.log(qh)
    // 		clearTimeout(t);
    // 		get(action)
    // 	});
}
var get = function(action) {
    console.log("爬取时间");

//     s=setInterval(function() {
//     superagent.get(action).end(function(err, sres, next) {
//         if (err) {
//             return next(err);
//         }
//         var $ = cheerio.load(sres.text);
//         var qh = $('#data-listbody tr').eq(1).text();
//         miunt = $('#opentime .time').text();
//         miunt = miunt * 1000;
    
//         console.log('当前期数' + qh);
//         console.log(miunt)
//     });
// }, miunt);
    superagent.get(action).end(function(err, sres, next) {
        if (err) {
            return next(err);
        }
        var $ = cheerio.load(sres.text);
        var qh = $('#data-listbody tr').eq(1).text();
        var miunt = $('#opentime .time').text();
        miunt = miunt * 1000;
        console.log(miunt)
        console.log('当前期数' + qh);
        s=setTimeout(function(){
        	console.log('第二次')
        },miunt);
        console.log('定时开始')
    //     // $('#panle').each(function(i,element){
    //     // 	console.log(i);
    //     // })
    //     // $('#panle').nextAll('tbody').each(function(i,m){
    //     // 	console.log(i);
    //     // 	console.log(m);
    //     // });
    //     // $('#panle').find('tbody').find('tr').each(function(i,m){
    //     // 	console.log(m);
    //     // });
    //     // console.log(sres.text)
    //     // console.log(sres.text);
    //     // $('tr').each(function (i,element) {
    //     // 	$(element).each(function (i,element) {		
    //     // 			console.log(i);
    //     // 		item.push({
    //     // 		 '期数':$(element).val(),
    //     // 		 '开奖时间':$(element).val(),
    //     // 		 '开奖结果':$(element).val()
    //     // 	});				
    //     // 	})
    //     // })
    //     // n=n+1;
    //     // 	fs.writeFile('data.txt',sres.text, function(err) {
    //     // 	if (err) {
    //     // 		return console.error(err);
    //     // 	}
    //     // 	console.log("写入成功");
    //     // })
    });
    //item=item.join('<br/>')
    // 	app.get('/',function(req,res,next) {	
    // 		superagent.get('https://cnodejs.org/')
    // 		.query({
    // 			tab: 'all'
    // 		})
    // 		.query({
    // 			page:n                        //tab=all&page=2
    // 		})
    // 		.end(function (err,sres) {
    // 			if (err) {
    // 				return next(err);
    // 			}
    // 			var $=cheerio.load(sres.text);
    // 			$('.cell').each(function (i,element) {
    // 				$(element).each(function (i,element) {					
    // 					item.push({
    // 					 title:$(element).find('.topic_title').attr('title'),
    // 					  href:$(element).find('.topic_title').attr('href'),
    // 					  user:$(element).find('img').attr('title'),
    // 				});				
    // 				})
    // 			})
    // 			res.send(item);
    // 		});
    // 		n=n+1;
    // 		console.log('page'+n);
    // 		console.log('size'+item.length)
    // });
}

var setInt = function() {
    //setInterval(get,2000,'https://cnodejs.org/');
    // get('http://www.pc28.am/')
    // get('http://www.pceggs.com/')
    get('https://www.zao28.com/xy28')
        // get('http://www.28shence.com/xxw.php?3.1.1')
        // get('https://cnodejs.org/');
        // get('http://dandan28.com/mobile.php');
}
exports.setint = setInt;
//setInt();
app.listen(3880, function() {
    console.log('爬取数据');
})