# UserJS
UserJS是一个实现用户相关功能的组件,需要与mongodb native驱动配合使用.

#### require
mongodb native driver > 2.0
node > 5.0.0

### get started
首先安装mongodb native driver.
```bash
npm install userjs
```

```javascript
//require lib
let User = require('userjs');
let user = new User();
//set connection
const mongodb = require('mongodb');
mongodb.connect('mongodb://localhost:27017/userjs')
    .then(function (db) {
        // set collection reference using set collection function
        user.collection = db.collection('user');
        //register function
        user.register({
            email: "test@test.com",
            password: "test"
            }).then((result) => {
                console.log(result);
                //true
            });
        //login function
        user.login({
            email: "test@test.com",
            password: "test"
            }).then((result) => {
                console.log(result);
                //true
            });
    })
    .catch(function (error) {
        throw(error);
    });
```
## functions
### get collection
get collection instance
return collection instance
### set collection
set collection instance
### login
login function, return a Promise which will resolve the result of the login process.
If match was found in the database, resolve `true`.
If match was not found in the database, resolve `false`.
if some errors occurred, reject this error.
### register
register function, return a Promise which will resolve the result of register process.
If no user has been register, register it, resolve `true`.
If some user has been registered, resolve `false`.
if some errors occurred, reject this error.