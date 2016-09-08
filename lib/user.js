/**
 * Created by Spencer on 15/12/21.
 */
'use strict';

module.exports = function User(db, router) {

    // register
    router.post('/register', function * (next) {
        const bcrypt = require('../lib/bcrypt');
        const jwt = require('jsonwebtoken');
        const secret = process.env.JWT_SECRET || require('../secret');

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
    router.get('/user/:id', function * (next) {

    });
};
