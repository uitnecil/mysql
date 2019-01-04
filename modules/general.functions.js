/**
 *
 * @param res
 * @param status - http status to respond to the client
 * @param msg - message to send to client as json
 * @returns {*}
 */
module.exports.sendMsg = (res, status, msg) => res.status(status).json((msg instanceof Object) ? msg : {message: msg});

/*
    switch (true) {
        // if custom error
        case (err instanceof CustomError):
            console.log(`[ERROR instanceof CustomError] - `, err);
            sendMsg(res, err.code, {code: err.code, message: err.message});
            break;

        // if normal error
        case (err instanceof Error):
            console.log(`[ERROR instanceof Error] - `, err);
            sendMsg(res, 500, errorMessages.UNEXPECTED_ERROR);
            break;

        // other possible cases
        default:
            console.log(`[ERROR DEFAULT] - `, err);
            sendMsg(res, 500, errorMessages.UNEXPECTED_ERROR);
            break;
    }
*/
