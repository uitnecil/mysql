const { sendMsg } = require('../../modules/index');
const { DB } = require('../../modules/index');

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
    // })

    const handleSuccess = res => rows => {
            // console.log('data', rows);
            console.log('Number of records', rows.length);
            sendMsg(res, 200, rows);
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

    DB.query('SELECT id, name, address FROM customers', null)
        .then(handleSuccess(res))
        .catch(handleError(res))
};