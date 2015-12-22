/**
 * Created by Spencer on 15/12/21.
 */
'use strict';
require('babel-register');
class User {
    constructor() {
    }

    /**
     * get collection reference
     * @return {object} dbCollection
     * */
    get dbCollection() {
        return this.collection;
    }

    /**
     * set collection reference
     * @param {object} coll collection reference
     * */
    set dbCollection(coll) {
        this.collection = coll;
    }

    /**
     * login
     * @method login
     * @param {string} email login email
     * @param {string} password login password
     * @return {object} promise resolve
     * */
    async login(email, password) {
        try {
            let result = await this.collection.find({
                email: email,
                password: password
            }).toArray();
            if (result.length === 1) {
                return true;
            }
            if (result.length === 0) {
                return false;
            }
        } catch (e) {
            console.log(e.stack);
            return e;
        }
    }

    /**
     * register
     * @method register
     * @param {string} email login email
     * @param {string} password login password
     * @return {promise}
     * @resolve result
     * @reject error
     * */
    async register(email, password) {
        try {
            let isRegistered = await this.collection.find({email: email, password: password}).toArray();
            if (isRegistered.length === 0) {
                let result = await this.collection.insertOne({email: email, password: password});
                return !!result.result.ok;
            } else {
                return false;
            }
        } catch (e) {
            console.error(e.stack);
            return e;
        }
    }
}

module.exports = User;