let jwt = require('jsonwebtoken');
const secret = require('../config.json').secret;
function * parseBearerToken (next){
    let token = this.request.header.Authorization.split(' ')[1];
    let verified = yield jwtVerifyPromise(token, secret);
    if(verified){
        this.context.token = verified;
        yield next;
    } else {
        this.throw(403, 'token not verified, please relogin first');
    }     
}

function jwtVerifyPromise(token, secret) {
    return new Promise(function(resolve, reject){
        jwt.verify(token, secret, function(err, decoded){
            if (err || !decoded) {
                resolve(decoded);
            } else {
                reject(false);
            }
        });
    });
}
module.exports = parseBearerToken;