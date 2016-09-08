const Mongo = require('mongodb');
/**
 * Created by Spencer on 16/1/15.
 */
'use strict';
// middlewares
let allowMethod = require('./middlewares/allowMethods');
let parseBody = require('./middlewares/parseBody');
let cors = require('koa-cors');
// router
let router = require('./router');
/* Create Koa Server */
let app = require('koa')();
app.use(cors());
app.use(allowMethod(['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']));
app.use(parseBody);
app.use(router.routes());

module.exports = app;
Mongo.connect('mongodb://localhost:27017/auth', (err, db) => {
    if (err) {
        app.throw(500);
    }
    app.context.db = db;
    app.listen(8080);
});