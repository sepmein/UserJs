'use strict';
// lib
const Mongo = require('mongodb');
const cors = require('koa-cors');
let app = require('koa')();

// local lib
let allowMethod = require('./middlewares/allowMethods');
let parseBody = require('./middlewares/parseBody');
let router = require('./lib/user.js');

// Create Koa Server
app.use(cors());
app.use(allowMethod(['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']));
app.use(parseBody);
app.use(router.routes());

function server(config) {
    // configuration
    const CONFIG = config || require('./config');

    Mongo.connect('mongodb://localhost:27017/' + CONFIG.collection, (err, db) => {
        if (err) {
            app.throw(500);
        }
        app.context.CONFIGURATION = CONFIG;
        app.context.db = db;
        app.context.collection = db.collection(CONFIG.collection);
        app.listen(CONFIG.port);
    });
}

module.exports = server;