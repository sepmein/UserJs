/**
 * Created by Spencer on 15/12/21.
 */
'use strict';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-promise');
const secret = process.env.JWT_SECRET || require('../config.json').secret;

let router = require('koa-router')();
router.post('/login', function * () {
    let userName = this.request.body.userName;
    let password = this.request.body.password;

    let result =
    yield this.collection.find({
        userName: userName
    }).toArray();
    let found = (result.length === 1);
    if (found) {
        let user = result[0];
        try {
            var same = yield bcrypt.compare(password, user.password);
            if (same) {
                this.body = {
                    token: jwt.sign({
                        userName: userName,
                        _id: user._id
                    }, secret)
                };
            } else {
                this.status = 401;
                this.body = {message: 'password not match'};
            }
        } catch (e) {
            // this.throw(500, e);
            this.status = 500;
            this.body = {message: 'Server Error: bcrypt compare error'};
        }
    } else {
        this.status = 401;
        this.body = {message: 'User not exist'};
    }
});
// register
router.post('/register', function * () {
    let userName = this.request.body.userName;
    let password = this.request.body.password;
    let result = yield this.collection.find({userName: userName}).toArray();
    let existed = (result.length === 1);
    if (existed) {
        this.status = 403;
        this.body = {message: 'user already existed'};
        return;
    }
    let hash;
    try {
        hash = yield bcrypt.genHash(password);
    } catch (e) {
        this.throw(500, 'failed to register');
    }
    try {
        let user = yield this.collection.insertOne({
            userName: userName,
            password: hash
        });
        // use jwt to generate token
        let token = jwt.sign({
            userName: userName,
            _id: user._id
        }, secret, {
            expiresIn: '7d'
        });
        this.status = 201;
        this.body = {
            userName: userName,
            token: token
        };
    } catch (error) {
        this.status = 400;
        this.body = {message: error.message};
    }
});
// get user info
router.get('/user/:id', function * () {

});

module.exports = router;
