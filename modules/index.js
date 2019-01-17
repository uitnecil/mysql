module.exports.routerIntercept = require('./router.intercept');
module.exports.logger = require('../../../tmp/mysql-nodejs/modules/logger').logger;
module.exports.sendMsg = require('./general.functions').sendMsg;
module.exports.DB = require('./connectionPool');
module.exports.DB1 = require('./connectionPoolTransaction');