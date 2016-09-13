const config = require('../config').mail;
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    host: config.host,
    auth: {
        user: config.user,
        pass: config.pass
    }
});

// templates
function createMailTemplates(options) {
    return {
        from: options.from || config.from,
        to: options.to,
        text: options.content,
        html: options.html
    };
}

// promise codes
function sendResetEmail(options) {
    return new Promise(function (resolve, reject) {
        transporter.sendMail(createMailTemplates(options), function (error, info) {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
}

exports.sendResetEmail = sendResetEmail;