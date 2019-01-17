const Bluebird= require('bluebird');
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


const DB = (function() {

    /**
     * Executes a query on the database. Uses Callbacks
     * @param {string} query     Query string. Can contain one or multiple '?'
     *                            which will be replaced with the corresponding values from the params array
     * @param {array} params     An array of values to replace the '?' from the query.
     * @param {function} callback Callback function
     * @private
     */
    function _queryCb(query, params, callback) {
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

    /**
     * Executes a query on the database. Uses Promises
     * @param {string} query     Query string. Can contain one or multiple '?'
     *                            which will be replaced with the corresponding values from the params array
     * @param {array} params     An array of values to replace the '?' from the query.
     * @returns {Promise<Bluebird<never | any>>}
     */
    async function _queryPromise(query, params) {
        const connection = await pool.getConnectionAsync();
        return connection.queryAsync(query, params)
            .then((results) => {
                connection.release();
                return results;
            })
            .catch(err => {
                connection.release();
                return Promise.reject(err);
            })
    }

    /**
     * Runs a list of queries on the database using a transaction.
     * A list of queries and query values to inject into the queries are expected.
     * @param {array} queries           An array of mysql queries. These can contain `?`s
     *                           which will be replaced with values in `params`.
     * @param {array} params       An array of arrays that is the same length as `queries`.
     *                           Each array in `params` should contain values to
     *                              replace the `?`s in the corresponding query in `queries`.
     *                              If a query has no `?`s, an empty array should be provided.
     * @returns {Promise<Bluebird<never | any>>}
     */
    async function _transaction(queries, params) {
        const connection = await pool.getConnectionAsync();

        return connection.beginTransactionAsync()
            .then(() => {
                const queryPromises = [];

                queries.forEach((query, idx) => {
                    queryPromises.push(connection.queryAsync(query, params[idx]));
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
        queryCb: _queryCb,
        query: _queryPromise,
        transaction: _transaction
    };
})();

module.exports = DB;