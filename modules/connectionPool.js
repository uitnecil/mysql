const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    host: 'localhost',
    user: 'lice',
    password: 'MyPassword1',
    database: 'mydb'
});


const DB = (function() {
    function _query(query, params, callback) {
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                callback(err, null);
                throw err;
            }

            console.log(`===> connection retrieved`);
            connection.query(query, params, function (err, results, fields) {
                connection.release();
                if (!err) {
                    callback(null, results, fields);
                } else {
                    callback(err, null);
                }
            });

            connection.on('error', function (err) {
                console.log('2. here!!!');
                connection.release();
                callback(err, null);
                throw err;
            });
        });
    }

    return {
        query: _query
    };
})();

module.exports = DB;