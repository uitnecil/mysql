const Rx = require('rxjs');
const fs = require('fs');
const dateFormat = require('dateformat');
const cluster = require('cluster');

class logger {
    constructor(logFile) {
        this.logFile = logFile || "log.txt";
    }

    error(...message) {
        const status = 'ERROR';
        this.writeRaw(status, ...message);
    }

    warn(...message) {
        const status = 'WARN';
        this.writeRaw(status, ...message);
    }

    info(...message) {
        const status = 'INFO';
        this.writeRaw(status, ...message);
    }

    writeRaw(status, ...message) {
        // check if in cluster environment; if true add worker id in front of each logged line
        let clusterPrefix = '';
        if (cluster.isWorker) {
            clusterPrefix += `Cluster ID: [${cluster.worker.id}] - `
        }

        // concatenate all messages to be logged
        const theMessage = message.reduce((acc, v) => acc += v, clusterPrefix);
        const writeToFile = status => msg => {
            dateFormat.masks.customTime = 'dd.mm.yyyy HH:MM:ss';
            const date = dateFormat(new Date(), "customTime");
            // log to console
            if (process.env.NODE_ENV !== 'test') {
                console.log(`${date} - [${status}] - ${msg}`);
            }

            // log to file
            const buffer = date + " - [" + status + ']: ' + msg + '\n';
            const stream = fs.createWriteStream(this.logFile, {flags: 'a'});
            stream.write(buffer);
            stream.end();
            return Rx.Observable.empty();
        };

        Rx.Observable.of(theMessage)
            .mergeMap(writeToFile(status))
            .subscribe(
                null,
                err => console.log(`Inside logger => An error has occurred`, err),
                null
            )
    }

}

module.exports.logger = new logger(`everything.log`);