const {sendMsg} = require('../../modules/index');
const {DB} = require('../../modules/index');

module.exports = (req, res) => {
    // DB.query('SELECT id, name, address FROM customers', null, (err, rows, fields) => {
    //     if (err) {
    //         console.log('Database error occurred...');
    //         sendMsg(res, 500, 'Some error occurred!');
    //         return;
    //     }
    //
    //     console.log('data', rows);
    //     // console.log('fields', fields);
    //     sendMsg(res, 200, rows);
    // });

/*    const queries = [
        "INSERT INTO customers (name, address) VALUES ('Company Inc3', 'Highway 37')",
        "INSERT INTO customers (name, address) VALUES ('Company Inc4', 'Highway 37')",
        "INSERT INTO customers (name, address, Jeez) VALUES ('Company Inc', 'Highway 37', 'AAA')",
    ];*/

    const handleSuccess = res => results => {
        // console.log('success', results);
        sendMsg(res, 200, 'Success');
    };

    const handleError = res => err => {
        // console.log('error', err);
        let msg;
        switch (true) {
            case err.sqlMessage:
                console.log(`sqlMessage`, err.sqlMessage);
                msg = err.sqlMessage;
                break;
            case err.code === 'ECONNREFUSED':
                msg = 'Database connection refused, please try again later';
                break;
            default:
                msg = 'Internal error occurred. Please try again later.'
        }
        sendMsg(res, 500, `Error: ${msg}`);

    };

    const queries = req.body.queries;
    const params = req.body.queriesParams;

    DB.transaction(queries, params)
        .then(handleSuccess(res))
        .catch(handleError(res))
};