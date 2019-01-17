const chai = require('chai');
const {expect, assert} = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const {DB} = require('../../modules/index');
const randomString = require('randomstring');
chai.use(sinonChai);

describe('[/api/v1/customers/get-all] - tests ', function () {
    const server = require('../../app');

    it('prepares test data ... 100 addresses', function (done) {
        const createRecord = () => {
                const name = randomString.generate(Math.floor(Math.random() * 10 + 10));
                const address = randomString.generate({
                    length: Math.floor(Math.random() * 10 + 10),
                    charset: 'alphabetic'
                });
                return DB.query("INSERT INTO customers (name, address) VALUES (?, ?)", [name, address]);
        };
        let allPromises = [];
        for (let i = 1; i <= 100; i++) {
            allPromises.push(createRecord());
        }
        Promise.all(allPromises)
            .then(() => done())
            .catch((err) => done(err))
    });

    it('tests retrieve all', function (done) {
        request(server)
            .get('/api/v1/customers/get-all')
            .set('Accept', 'application/json')
            .expect(res => {
                expect(res, 'response').not.to.be.null;
            })
            .expect(200, done);
    });

    it('cleans up data - removes last 100 rows', function (done) {
        const queries = [
            'DELETE FROM customers ORDER BY id ASC limit 100',
            // 'ALTER TABLE customers MODIFY COLUMN ID INT(11) UNSIGNED',
            // 'ALTER TABLE customers MODIFY COLUMN ID INT(11) NOT NULL AUTO_INCREMENT',
            'SELECT MAX(ID) FROM customers'
        ];

        const promises = [];
        queries.forEach((val) => promises.push(DB.query(val, null)));

        Promise.all(promises)
            .then(() => done())
            .catch(err => done(err));
        // const promise = DB.query("DELETE FROM customers ORDER BY id ASC limit 100", null, (err, res) => {
            // console.log('delete result', res);
            // expect(res.affectedRows).to.be.equal(100);
            // done();
        // });
        // done();
    })


});