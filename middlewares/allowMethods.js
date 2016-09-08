/**
 * Created by Spencer on 16/2/17.
 */
'use strict';
module.exports = function allowMethod(methods) {
    return function * (next) {
        let thisMethod = this.method;
        let match = methods.some((method) => {
            return thisMethod === method;
        });
        if (match) {
            yield next;
        } else {
            this.throw(405);
        }
    };
};
