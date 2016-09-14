# UserJS
##### Clean user account API server, just install and ready to go.
##### Using Mongodb as database system and node.js as Backend.

#### **FEATURES**
* Rest API
* Security: Bcrypt as hash for password storage and json web token as authentication system.
* Forgot and reset password function, using nodemailer to send reset email.
* 

### **GET STARTED**

0. Enviroment Setup

Just install `Node.js` and `MongoDb` first.

1. Installation

```bash
npm install userjs
```

2. Configuration

Rename `config-example.js` to `config.js`
Example:
```javascript
/**
 * Configuration
 */
module.exports = {
    'site': 'localhost',                            //site address for the mail system to generate reset link
    'collection': 'authentication',                 //MongoDb collection name for the data storage
    'port': '8080',                                 //site port
    'secret': '12345678',                           //secret string for jsonwebtoken generating token 
    mail: {                                         //mail configuration
        from: '"张春哲" <zhangchunzhe@scdc.sh.cn>',  //sender address  
        host: 'smtp-mail.outlook.com',              //host mail smtp address
        user: 'user@mail.com',                      //smtp server login username
        pass: '12345678'                            //smtp server login password
    }
};
```
## **API**

### Login
login api, send plain json email and password.
return token if match.

### Register
register api