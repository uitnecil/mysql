const chai = require('chai');
const {expect, assert} = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const {DB} = require('../../modules/index');
const randomString = require('randomstring');
chai.use(sinonChai);

describe('[/api/v1/customers/add-transaction] - tests ', function () {
    const server = require('../../app');

/*
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
*/

    it('fails transaction made of list of queries if a query from it fails', function (done) {
        request(server)
            .put('/api/v1/customers/add-transaction')
            .send({queries: [
                    "INSERT INTO customers (name, address) VALUES (?, ?)",
                    "INSERT INTO customers (name, address) VALUES (?, ?)",
                    "INSERT INTO customers (name, address, Jeez) VALUES (?, ?, ?)"
                ],
                queriesParams: [
                    ['Company Inc3', 'Highway 37'],
                    ['Company Inc4', 'Highway 37'],
                    ['Company Inc', 'Highway 37', 'AAA']
                ]})
            .set('Accept', 'application/json')
            .expect(res => {
                expect(res, 'response').not.to.be.null;
            })
            .expect(500, done);
    });

    /*
    it('cleans up data', function (done) {
        const execQuery = (query, params = null) => {
            return new Promise((resolve, reject) => {
                DB.query(query, params, (err, data) => {
                    if (err) {
                        console.log('Database error occurred...');
                        reject(err);
                        return;
                    }
                    // console.log('query result', data);
                    resolve(data);
                })
            })
        };


        const queries = [
            'DELETE FROM customers ORDER BY id ASC limit 100',
            // 'ALTER TABLE customers MODIFY COLUMN ID INT(11) UNSIGNED',
            // 'ALTER TABLE customers MODIFY COLUMN ID INT(11) NOT NULL AUTO_INCREMENT',
            'SELECT MAX(ID) FROM customers'
        ];

        const promises = [];
        queries.forEach((val) => promises.push(execQuery(val)));

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
    */

});