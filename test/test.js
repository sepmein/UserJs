/**
 * Created by Spencer on 15/12/21.
 */
'use strict';
//test framework
const chai = require('chai');
const expect = chai.expect;

//db dependencies
const mongodb = require('mongodb');
const User = require('../lib/user.js');
let db, user, collection;

describe('UserJs', function () {
    before(function (done) {
        user = new User();
        mongodb.connect('mongodb://localhost:27017/test.userjs')
            .then(function (dbInstance) {
                db = dbInstance;
                collection = db.collection('user');
                done();
            })
            .catch(function (error) {
                throw(error);
            });
    });
    describe('db connection', function () {
        it('could connect to mongodb', function () {
            expect(db).to.be.a('object');
            expect(collection).to.be.a('object');
        });
    });
    describe('get and set collection', function () {
        it('could get and set collection', function () {
            user.collection = collection;
            expect(user.collection).to.equal(collection);
        });
    });
    describe('login', function () {
        //reset database
        before(function (done) {
            db.collection('user').removeMany({}, function (err, result) {
                if (!err) {
                    done();
                }
            });
        });
        //insert a doc for testing
        before(function (done) {
            db.collection('user').insertOne({email: 'sepmein@gmail.com', password: '111'}, function (err, result) {
                done();
            });
        });
        it('could login', function (done) {
            let email = 'sepmein@gmail.com';
            user.login(email, '111')
                .then(function (result) {
                    expect(result).to.be.true;
                    done();
                })
                .catch(done);
        });
    });

    describe('login', function () {
        //reset database
        before(function (done) {
            db.collection('user').removeMany({}, function (err, result) {
                if (!err) {
                    done();
                }
            });
        });
        //login should fail
        it('can\'t login if not registered', function (done) {
            let email = 'sepmein@gmail.com';
            user.login(email, '111')
                .then(function (result) {
                    expect(result).to.be.false;
                    done();
                })
                .catch(done);
        });
    });
    describe('register', function () {
        it('could register if not registered', function (done) {
            let userEmail = 'sepmein@gmail.com';
            user.register(userEmail, '111')
                .then(function (result) {
                    expect(result).to.be.true;
                    done();
                })
                .catch(function (error) {
                    console.log(error);
                    expect(error).to.not.exist();
                    done();
                });
        });
        it('could not register if registered', function (done) {
            let userEmail = 'sepmein@gmail.com';
            user.register(userEmail, '111')
                .then(function (result) {
                    expect(result).to.be.false;
                    done();
                })
                .catch(function (error) {
                    console.log('called');
                    console.log(error);
                    expect(error).to.not.exist();
                    done();
                });
        });
    });
});