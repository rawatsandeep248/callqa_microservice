const randToken = require('rand-token');
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require('express-validator')
const COLLECTIONDETAIL = require('../database/collection-details');
// const OauthUtil = require("../utils/Oauth-util");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const privateKey = '2A472D4B6150645367566B59703373367639792F423F4528482B4D6251655468576D5A7134743777217A25432646294A404E635266556A586E3272357538782F413F4428472D4B6150645367566B5970337336763979244226452948404D6251655468576D5A7134743777217A25432A462D4A614E645266556A586E3272357538782F413F4428472B4B6250655368566B5970337336763979244226452948404D635166546A576E5A7134743777217A25432A462D4A614E645267556B58703273357638782F413F4428472B4B6250655368566D597133743677397A244226452948404D635166546A576E5A7234753778214125442A462D4A614E645267556B58703273357638792F423F4528482B4B6250655368566D597133743677397A24432646294A404E635166546A576E5A7234753778214125442A472D4B6150645367556B58703273357638792F423F4528482B4D6251655468576D597133743677397A24432646294A404E635266556A586E327234753778214125442A472D4B6150645367566B59703373367638792F423F4528482B4D6251655468576D5A7134743777217A24432646294A404E635266556A586E3272357538782F413F442A472D4B6150645367566B59703373367639792442264529482B4D6251655468576D5A7134743777217A25432A462D4A614E635266556A586E3272357538782F413F'

class CommonUtil {
    constructor() {
    }

    static getMongooseCollection(collection) {
        return COLLECTIONDETAIL.details().schemas.database.collection[collection];
    }

    static getCustomerMongooseCollection(collection) {
        return COLLECTIONDETAIL.customerDetails().schemas.database.collection[collection];
    }

    static convertToTitleCase(str) {
        str = str.toLowerCase().split(' ');
        for (var i = 0; i < str.length; i++) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
        }
        return str.join(' ');
    };

    static pickRandomValue(array) {
        let value = array[Math.floor(Math.random() * array.length)];
        return value;
    };

    static generateToken(bits) {
        return new Promise((resolve, reject) => {
            try {
                let tokenBits = 16;
                if (bits) {
                    tokenBits = bits;
                }
                let token = randToken.generate(tokenBits);
                resolve(token);
            } catch (err) {
                reject(err);
            }
        });
    }

    
    static generate(bits) {
        this.numeric = '0123456789';
        this.alphaLower = 'abcdefghijklmnopqrstuvwxyz';
        this.alphaUpper = this.alphaLower.toUpperCase();
        this.alphaNumeric = this.numeric + this.alphaUpper + this.alphaLower;
        if (!bits) {
            bits = 8;
        }
        var chars = this.alphaNumeric;
        var max = Math.floor(256 / chars.length) * chars.length;
        var key = "";
        while (key.length < bits) {
            var arr = this.randomArray(bits - key.length);
            for (var i = 0; i < arr.length; i++) {
                var x = arr[i];
                if (x < max) {
                    key += chars[x % chars.length];
                }
            }
        }
        return key;
    }

    static randomArray(size) {
        try {

            let arr = [];
            for (let count = 0; count < size; count++) {
                arr.push((Math.random() * 500).toFixed(0))
            }
            return arr;
        } catch (error) {
            return error
        }
    }

    static generate_bot_id(bits) {

        return new Promise((resolve, reject) => {
            try {
                let numeric = '0123456789';
                let alphaLower = 'abcdefghijklmnopqrstuvwxyz';
                let alphaUpper = alphaLower.toUpperCase();
                let alphaNumeric = numeric + alphaUpper + alphaLower;
                let tokenBits = 8;
                if (bits) {
                    tokenBits = bits;
                }
                var chars = alphaNumeric;
                var max = Math.floor(256 / chars.length) * chars.length;
                var key = "";
                while (key.length < bits) {
                    var arr = this.randomArray(bits - key.length);
                    for (var i = 0; i < arr.length; i++) {
                        var x = arr[i];
                        if (x < max) {
                            key += chars[x % chars.length];
                        }
                    }
                }
                resolve(key);
            } catch (err) {
                reject(err);
            }
        });
    }

    static generateUniqueId() {
        return uuidv4();
    }

    static userID() {
        const bits = 8;
        let date = new Date();
        let components = [
            date.getMilliseconds(),
            date.getYear(),
            date.getMonth(),
            date.getSeconds(),
            date.getHours(),
            date.getMinutes(),
            date.getDate()

        ];
        let timestamp= components.join("");
        const ts = timestamp.toString();
        const parts = ts.split("").reverse();
        let key = "";
        for (let id = 0; id < bits; ++id) {
            let index = Math.floor(Math.random() * (parts.length - 1 + 1));
            key += parts[index];
        }
        return key;
    }

    static getCopy(object) {
        if (object) {
            return JSON.parse(JSON.stringify(object))
        }
        else return undefined
    }

    static ValidURL(str) {
        var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
        if (!regex.test(str)) {
            return false;
        } else {
            return true;
        }
    }

    static getDatabaseUrl(url, database) {
        url = url.replace('$user', database.user);
        url = url.replace('$password', database.password);
        url = url.replace('$host', database.host);
        url = database.port !== '""' ? url.replace('$port', database.port) : url.replace('$port', "27017");
        url = url.replace('$database', database.name);
        return url;
    }

    static async errorChecker(req, res, next) {
    let errors = validationResult(req);
    console.log("EROOOOOOOOOOOOOOOOOOOOOOORRRRRRRRRRR", errors)
    if (errors.isEmpty()) {
        return next();
    }
    res.status(400).json({
        errors: errors.array()?.map((obj) => {
            return obj;
        })
    })
    }

    async createJwt(data) {
        // data.iss= 'callai.com';86400
        let token = jwt.sign(data, privateKey, { expiresIn: 86400 });
        jwt.verify(token, privateKey, function (err, decoded) {
            if (err) {
                console.log("errrrrr", err)
            }
        });
        return token;
    }

    async createEncryptedPassword(password) {
        console.log("CREATING ENCRYPTED PASSWORD");
        return new Promise(
            (resolve, reject) => {
                bcrypt.hash(password, 10, function (err, hash) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(hash);
                    }
                });
            });
    };

    async comparePasswords (inputPassword,hashPassword){
        console.log("MATCH PASSWORDS");
        // console.log(inputPassword,hashPassword)
        return new Promise(
            (resolve, reject) => {
                bcrypt.compare(inputPassword, hashPassword, function (err, res) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(res);
                    }
                });
            });
    };

    static generateOTP() {
        const bits = 4;
        let date = new Date();
        let components = [
            date.getMilliseconds(),
            date.getYear(),
            date.getMonth(),
            date.getSeconds(),
            date.getHours(),
            date.getMinutes(),
            date.getDate()

        ];
        let timestamp= components.join("");
        const ts = timestamp.toString();
        const parts = ts.split("").reverse();
        let key = "";
        for (let id = 0; id < bits; ++id) {
            let index = Math.floor(Math.random() * (parts.length - 1 + 1));
            key += parts[index];
        }
        return key;
    }

    static async errorChecker(req, res, next) {
        let errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        res.status(400).json({
            errors: errors.array()?.map((obj) => {
                return obj;
            })
        })
    }

    static uniqueAlphaNumeric() {
        const length = 8;
        const chars =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
        // Use current timestamp to influence random generation (optional)
        const date = new Date();
        const seed = [
          date.getMilliseconds(),
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
          date.getSeconds(),
        ].join("");
        const parts = seed.split("").reverse();
    
        let key = "";
        for (let i = 0; i < length; i++) {
          const seedIndex = i % parts.length;
          const randomOffset = parseInt(parts[seedIndex]) || 0;
          const index =
            (Math.floor(Math.random() * chars.length) + randomOffset) %
            chars.length;
          key += chars[index];
        }
    
        return key;
      }

    static async fetchOpenaiVoices(openaiClient) {
        try {
            const response = await openaiClient.models.list();
            const ttsModels = response.data.filter((model) =>
                model.id.includes("tts")
            );
            return ttsModels || [];
        } catch (error) {
            console.error("Error fetching OpenAI voices:", error);
            throw error;
        }
    }
}

module.exports = CommonUtil;