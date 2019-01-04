const logger = require('./index').logger;
module.exports = (req, res, next) => {
    console.log(` PRE =>>>> req.body: `, req.body);
    const originalSend = res.send;
    res.send = function (data) {
        originalSend.apply(res, arguments);
        logger.info(` ----------INSIDE RES SEND--- START -------- `);
        console.log(` =>>>> REQUEST`);
        console.log(` =>>>> req connection remoteAddress: `, req.connection.remoteAddress);
        console.log(` =>>>> req.originalUrl (entire url): `, req.originalUrl);
        console.log(` =>>>> req.url: `, req.url);
        console.log(` =>>>> req.method: `, req.method);
        console.log(` =>>>> req.body: `, req.body);

        console.log(`=>>>> RESPONSE`);
        console.log(JSON.parse(arguments[0]));

        console.log(` ----------INSIDE RES SEND--- END -------- `)
    };
    next();
};

/*
module.exports = (req, res, next) => {
    console.log(` PRE =>>>> req.body: `, req.body);
    res.on("finish", function() {
        logger.info(` ----------AT RES.ON(FINISH)--- START -------- `);
        console.log(` =>>>> REQUEST`);
        console.log(` =>>>> req connection remoteAddress: `, req.connection.remoteAddress);
        console.log(` =>>>> req.originalUrl (entire url): `, req.originalUrl);
        console.log(` =>>>> req.url: `, req.url);
        console.log(` =>>>> req.method: `, req.method);
        console.log(` =>>>> req.body: `, req.body);

        console.log(`=>>>> RESPONSE`);
        console.log(res.body);
        console.log(res);

        console.log(` ----------AT RES.ON(FINISH)--- END -------- `)
    });

    next();
};
*/
