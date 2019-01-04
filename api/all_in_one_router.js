module.exports = function(app) {
    app.use('/api/v1/customers', require('./something/index'));
};