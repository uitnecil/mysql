const Bluebird = require('bluebird');
const mysql = require('mysql');
const Pool = require("mysql/lib/Pool");
const Connection = require("mysql/lib/Connection");
Bluebird.promisifyAll([Pool, Connection]);


const pool = mysql.createPool({
    connectionLimit: 20,
    host: 'localhost',
    user: 'lice',
    password: 'MyPassword1',
    database: 'mydb'
});


/**
 * Run multiple queries on the database using a transaction. A list of SQL queries
 * should be provided, along with a list of values to inject into the queries.
 * @param  {array} queries     An array of mysql queries. These can contain `?`s
 *                              which will be replaced with values in `queryValues`.
 * @param  {array} queryValues An array of arrays that is the same length as `queries`.
 *                              Each array in `queryValues` should contain values to
 *                              replace the `?`s in the corresponding query in `queries`.
 *                              If a query has no `?`s, an empty array should be provided.
 * @return {Promise}           A Promise that is fulfilled with an array of the
 *                              results of the passed in queries. The results in the
 *                              returned array are at respective positions to the
 *                              provided queries.
 */
const DB1 = (function() {
    async function _transaction(queries, queryValues) {
        // grab
        const connection = await pool.getConnectionAsync();

        return connection.beginTransactionAsync()
            .then(() => {
                const queryPromises = [];

                queries.forEach((query, idx) => {
                    queryPromises.push(connection.queryAsync(query, queryValues[idx]));
                });
                return Promise.all(queryPromises);
            })
            .then(results => {
                return connection.commitAsync()
                    .then(connection.release())
                    .then(() => {
                        return results;
                    });
            })
            .catch(err => {
                return connection.rollbackAsync()
                    .then(connection.release())
                    .then(() => {
                        return Promise.reject(err);
                    });
            });
    }

    return {
        transaction: _transaction
    }

})();


module.exports = DB1;
// module.exports.transaction = _transaction;


