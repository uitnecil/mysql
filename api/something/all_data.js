const { sendMsg } = require('../../modules/index');
const { DB } = require('../../modules/index');

module.exports = (req, res) => {
    DB.query('SELECT name, address FROM customers', null, (err, rows, fields) => {
        if (err) {
            console.log('Database error occurred...');
            sendMsg(res, 500, 'Some error occurred!');
            return;
        }

        console.log('data', rows);
        // console.log('fields', fields);
        sendMsg(res, 200, rows);
    })
};