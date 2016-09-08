'use strict';
const Mongo = require('mongodb');
const cors = require('koa-cors');
let app = require('koa')();

const CONFIG = require('./config');
let allowMethod = require('./middlewares/allowMethods');
let parseBody = require('./middlewares/parseBody');
let router = require('./router');

/* Create Koa Server */
app.use(cors());
app.use(allowMethod(['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']));
app.use(parseBody);
app.use(router.routes());

Mongo.connect('mongodb://localhost:27017/' + CONFIG.collection, (err, db) => {
    if (err) {
        app.throw(500);
    }
    app.context.db = db;
    app.listen(CONFIG.port);
});