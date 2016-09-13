/**
 * Created by Spencer on 15/12/21.
 */
'use strict';
// library included
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-promise');
const ObjectId = require('mongodb').ObjectId;
// configuration
const secret = process.env.JWT_SECRET || require('../config.json').secret;
// middlewares
let parseBearerToken = require('../middlewares/parseBearerToken');

// router
let router = require('koa-router')();
router.post('/login', function * () {
    let email = this.request.body.email;
    let password = this.request.body.password;

    let result =
    yield this.collection.find({
        email: email
    }).toArray();
    let found = (result.length === 1);
    if (found) {
        let user = result[0];
        try {
            var same = yield bcrypt.compare(password, user.password);
            if (same) {
                this.body = {
                    token: jwt.sign({
                        email: email,
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
router.post('/register', function * (next) {
    let email = this.request.body.email;
    let password = this.request.body.password;
    let isValidEmailAddress = /.+@.+\..+/i.test(email);
    if(!isValidEmailAddress) {
        this.throw(403, 'not valid email address');
        yield next;
        return;
    }
    let result = yield this.collection.find({email: email}).toArray();
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
            email: email,
            password: hash
        });
        // use jwt to generate token
        let token = jwt.sign({
            email: email,
            _id: user._id
        }, secret, {
            expiresIn: '7d'
        });
        this.status = 201;
        this.body = {
            email: email,
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

// get own infomation
router.get('/:email', function *(){
    
});

router.get('/forgot', function *(){
    
});

router.del('/delete', parseBearerToken, function *(next){
    try {
        let operation = yield this.collection.remove({_id: ObjectId(this.state.token._id)});
        let result = operation.result;
        if(!result.ok) {
            this.throw('403', 'Delete user failed, user does not exist');
        } else {
            this.body = {
                date: Date.now(),
                operation: {
                    field: 'authentication',
                    type: 'delete'
                },
                uid: this.state.token._id,
                result: 'success'
            };
            yield next;
        }
    } catch(e){
        if(e) this.throw(500,e);
    }
});

module.exports = router;
