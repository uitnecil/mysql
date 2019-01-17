'use strict';
process.title = 'node-mysql-lice';

const cluster = require('cluster');
const logger = require('./modules/logger').logger;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

if (cluster.isMaster) {
    console.log(`Environment: ${process.env.NODE_ENV}`)
}

if (
    cluster.isMaster &&
    process.env.NODE_ENV !== 'development' &&
    process.env.NODE_ENV !== 'development_local' &&
    process.env.NODE_ENV !== 'test' &&
    process.env.NODE_ENV !== 'test_local'
) {
    const numWorkers = require('os').cpus();
    logger.info(`Master cluster setting up ${numWorkers.length} workers`);
    numWorkers.forEach(() => {
        cluster.fork();
    });

    cluster.on('online', worker => {
        logger.info(`Worker ${worker.process.pid} is online`);
    });

    cluster.on('exit', worker => {
        logger.warn('Worker server died (ID: %d, PID: %d)', worker.id, worker.process.pid);
        logger.info('Starting a new worker');
        cluster.fork();
    });
} else {

    const app = require('./app');
    const http = require('http');
    const morgan = require('morgan');

    const httpServerPort = 7878;
    const server = http.createServer(app);

// enable logger
    app.use(morgan('dev'));

// Start the server
    const httpServerIp = '0.0.0.0';
    server.listen(httpServerPort, httpServerIp, (req, res) => {
        // change 1
        logger.info(`Server listening on ${httpServerIp}:${httpServerPort}`);
    });
    /*

        const httpServerIp = '192.168.2.179';
        server.listen(httpServerPort, httpServerIp, (req, res) => {
            logger.info(`Server listening on ${httpServerIp}:${httpServerPort}`);
        });

    */
    //
    // server.listen(httpServerPort, `localhost`, () => {
    //     logger.info(`Server listening on localhost:${httpServerPort}`);
    // });


}

