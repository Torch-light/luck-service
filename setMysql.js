var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'assinsass',
    database: 'luck'
});
var setmysql = {
    start: function() {
        connection.connect();
    },
    end: function() {
        connection.end();
    },
    selectMysql: function(obj, callback) {
        var select = 'SELECT *FROM CATHECTIC WHERE id=?';
        var id = [];
        id[0] = obj[0];
        connection.query(select, obj, function(err, rows, fields) {
            if (err) {
                throw err.message;
            }
            if (rows.length == 0) {
            	console.log('没有该条数据');
                return callback(obj);
            } else {
                console.log('有该条数据');
            }
        })
    },
    insertMysql: function(obj, callback) {
        var insert = 'INSERT INTO CATHECTIC (id,num,result,created_at)values(?,?,?,?)';
        connection.query(insert, obj, function(err, rows, fields) {
            if (err) {
                throw err.message;
            }
            return callback(obj);
        })
    },
    setSystem: function(obj) {
        var insert = 'UPDATE  SYSTEM set updateNum=?,updatePoints=? WHERE id=0';
        connection.query(insert, obj, function(err, rows, fields) {
            console.log('更新系统');
            if (err) {
                throw err.message;
            }
        })
        system = true;
    },
    updateUser: function(obj) {
        var insert = 'UPDATE  USERS set points=? WHERE id=?';
        connection.query(insert, obj, function(err, rows, fields) {
            if (err) {
                throw err.message;
            }
        })
    },
    setPoints: function(obj) {
        setmysql.getPoint(obj[1], function(result) {
            obj[0] = obj[0] + result[0].points;
            console.log('当前积分'+obj[0]);
            var insert = 'UPDATE  USERS set points=? WHERE name=?';
            connection.query(insert, obj, function(err, rows, fields) {
                if (err) {
                    throw err.message;
                }
            })
        })
    },
    getaction: function(obj, callback) {
        var SELECT = 'SELECT *FROM action WHERE num=?';
        connection.query(SELECT,obj, function(err, rows, fields) {
            if (err) {
                throw err.message;
            }
            if (rows) {
                return callback(rows);
            }
        })
    },
    getPoint: function(obj, callback) {
        console.log(obj);
        var SELECT = 'SELECT points FROM users WHERE name=?';
        connection.query(SELECT, obj, function(err, rows, fields) {
            if (err) {
                throw err.message;
            }
            if (rows) {
                return callback(rows);
            }
        })
    },
}
exports.setmysql = setmysql;