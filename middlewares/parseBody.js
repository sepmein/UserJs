/**
 * Created by Spencer on 16/2/17.
 */
const parse = require('co-body');
const is = require('is-js');

module.exports = function* parseBody(next) {
    try {
        this.request.body = yield parse.json(this);
    } catch (e) {
        this.throw(400, e);
    }
    if (!is.empty(this.request.body)) {
        this.assert(this.is('application/json'), 400, 'Only Accepts JSON');
    }
    yield next;
};
