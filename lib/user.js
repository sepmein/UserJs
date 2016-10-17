/**
 * Created by Spencer on 15/12/21.
 */
'use strict';
// library included
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-promise');
const ObjectId = require('mongodb').ObjectId;
let parseBearerToken = require('koa-parse-bearer-token');

const sendResetEmail = require('./mailer').sendResetEmail;
const generateRandomString = require('./generateRandomString');
const isValidEmailAddress = require('./testValidEmail');
// middlewares

// router
let router = require('koa-router')();
router.post('/login', function * () {
  const secret = process.env.JWT_SECRET || this.CONFIGURATION.secret;

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
  const secret = process.env.JWT_SECRET || this.CONFIGURATION.secret;

  let email = this.request.body.email;
  let password = this.request.body.password;
  if (!isValidEmailAddress(email)) {
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
    },
            secret,
      {
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
router.get('/user/:email', function * () {

});

// check if user email registered
router.get('/:email', function * (next) {
  let email = this.params.email;
  if (!isValidEmailAddress(email)) {
    this.throw(403, 'not valid email address');
    yield next;
    return;
  }
  try {
    let result = yield this.collection.findOne({email});
    if (result) {
      this.body = result;
    } else {
      this.throw(404);
    }
  } catch (e) {
    this.throw(500);
  }
});

router.post('/forgot', function * (next) {
  let email = this.request.body.email;
    // find User
  try {
    var user = yield this.collection.findOne({email: email});
  } catch (e) {
    this.throw(500);
  }
  if (!user) {
    this.throw(403, 'email does not exist');
    return;
  }
    // generate link
  let randomString = generateRandomString();
  try {
    var result = yield this.collection.update(
      {
        _id: ObjectId(user._id)
      },
      {
        $set: {
          forgot: {
            string: randomString,
            date: Date.now()
          }
        }
      }
        );
  } catch (error) {
    this.throw(500);
  }
    // send email
  if (!result) {
    this.throw(403);
  } else {
    let text = 'click this link to reset your password :\n';
    let link = this.CONFIGURATION.site + ':' + this.CONFIGURATION.port + '/reset/' + randomString;
    try {
      var sentResult = yield sendResetEmail({
        to: email,
        subject: 'reset password',
        html: '<p>' + text + '<a href=' + link + '>' + link + '</a>' + '</p>'
      }, this.CONFIGURATION.mail);
    } catch (e) {
      this.throw(500, e);
    }
    this.body = sentResult;
    yield next;
  }
});

router.post('/reset/:code', function * () {
  const secret = process.env.JWT_SECRET || this.CONFIGURATION.secret;

  let code = this.params.code;
  let newPassword = this.request.body.password;
  if (!newPassword) {
    this.throw(400, 'please provide new password');
    return;
  }
  try {
    var found = yield this.collection.findOne({
      'forgot.string': code
    });
  } catch (e) {
    this.throw(500);
  }
  if (!found) {
    this.throw(400, 'user not found');
  } else {
        // genHash
    try {
      var hash = yield bcrypt.genHash(newPassword);
      var operation = yield this.collection.update(
        {
          _id: ObjectId(found._id)
        },
        {
          $set: {
            password: hash,
            forgot: null
          }
        }
            );
      if (operation.result.ok) {
                // use jwt to generate token
        let token = jwt.sign({
          email: found.email,
          _id: found._id
        },
                    secret,
          {
            expiresIn: '7d'
          });
        this.status = 201;
        this.body = {
          email: found.email,
          token: token
        };
      } else {
        this.throw(500);
      }
    } catch (e) {
      this.throw(500, 'failed to reset password');
    }
  }
});

router.del('/delete', parseBearerToken, function * (next) {
  try {
    let operation = yield this.collection.remove({_id: ObjectId(this.state.token._id)});
    let result = operation.result;
    if (!result.ok) {
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
  } catch (e) {
    if (e) this.throw(500, e);
  }
});

module.exports = router;
