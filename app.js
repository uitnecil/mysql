const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
const morgan = require('morgan');
const router = require('./api/all_in_one_router');
const http = require('http');
const logger = require('../../tmp/mysql-nodejs/modules/logger').logger;
const mysql = require('mysql');

/*
    const https = require("https"),
        fs = require("fs");

    const options = {
        key: fs.readFileSync("ssl/e089c_f099f_b5d8153fc5192b92ef09a81aad70adee.key"),
        cert: fs.readFileSync("ssl/servergs_edtehno_info_e089c_f099f_1544702009_f08431b6d3337a577c2b74f0ef0b2010.crt")
    };
    // https server - comment the http server when using this one
    // const server = https.createServer(options, app);

*/


const app = express();

/*
//connect to MongoDB
mongoose.connect('mongodb://localhost/Users', { useNewUrlParser: true, useCreateIndex: true } )
    .catch(() => {
        logger.info(`Could not connect to database`);
    });
const db = mongoose.connection;

db.on('error', (err) => {
    logger.error('connection error', err);
    logger.error('Check that the database daemon is started');
    process.exit();

});
db.once('open', () => logger.info('MongoDB connection successful'));
*/

/*
// create mysql connection
const con = mysql.createConnection({
    host: 'localhost',
    user: 'lice',
    password: 'MyPassword1',
    database: "mydb"

});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to mysql");

    // const sql = "CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))";
    // const sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
    const sql = "SELECT name, address FROM customers";

    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        // console.log("Table created");
        // console.log(fields);
        console.log(result);
    });

});
*/

app.use(cors());
app.all('/*', (req, res, next) => {
    if (req.method === 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// log all incoming requests/ routes/ verbs & their responses
const { routerInterceptor } = require('./modules/index');
// app.use(routerInterceptor);

// activate all routes
router(app);

// if no route matches it must be a 404
app.use((req, res, next) => {
    let err = new Error(`route [${req.url}] not Found...`);
    err.status = 404;
    next(err);
});

module.exports = app;