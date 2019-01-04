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
            return new Promise((resolve, reject) => {
                const name = randomString.generate(Math.floor(Math.random() * 10 + 10));
                const address = randomString.generate({
                    length: Math.floor(Math.random() * 10 + 10),
                    charset: 'alphabetic'
                });
                DB.query("INSERT INTO customers (name, address) VALUES (?, ?)", [name, address], (err, data) => {
                    if (err) {
                        console.log('Database error occurred...');
                        reject(err);
                        return;
                    }
                    // console.log('data', data);
                    resolve(data);
                })
            })

            // {
            //         expect(res.body).not.to.be.empty;
            //         expect(res.body.invitationCode).not.to.be.null;
            //         testInvitations.push(res.body.invitationCode)
            //     })
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
    })
});