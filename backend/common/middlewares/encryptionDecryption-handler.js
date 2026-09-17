const CryptoJS = require('crypto-js');
const crypto = require('crypto');

class encryptionDecryptionHandler {
    constructor(config) {
        this.config = config;
        this.decryptionMiddleware = this.decryptionMiddleware.bind(this);
        this.encryptionMiddleware = this.encryptionMiddleware.bind(this);
        this.encryptionForLogin = this.encryptionForLogin.bind(this);
        this.encryptionRoutesWithoutLogginSessions = this.encryptionRoutesWithoutLogginSessions.bind(this);
    }
    async decryptionMiddleware(req, res, next) {
        try {
            if (req.body.encryptedData) {
                if (req.headers && req.headers['enc-flag'] && req.headers['enc-flag'] === 'disable') {
                    console.log("DECRYPTION LAYER 2 STARTED")
                    let key = '2A472D4B6150645367566B59703373367639792F423F4528482B4D6251655468576D5A7134743777217A25432646294A404E635266556A586E3272357538782F413F4428472D4B6150645367566B5970337336763979244226452948404D6251655468576D5A7134743777217A25432A462D4A614E645266556A586E3272357538782F413F4428472B4B6250655368566B5970337336763979244226452948404D635166546A576E5A7134743777217A25432A462D4A614E645267556B58703273357638782F413F4428472B4B6250655368566D597133743677397A244226452948404D635166546A576E5A7234753778214125442A462D4A614E645267556B58703273357638792F423F4528482B4B6250655368566D597133743677397A24432646294A404E635166546A576E5A7234753778214125442A472D4B6150645367556B58703273357638792F423F4528482B4D6251655468576D597133743677397A24432646294A404E635266556A586E327234753778214125442A472D4B6150645367566B59703373367638792F423F4528482B4D6251655468576D5A7134743777217A24432646294A404E635266556A586E3272357538782F413F442A472D4B6150645367566B59703373367639792442264529482B4D6251655468576D5A7134743777217A25432A462D4A614E635266556A586E3272357538782F413F';
                    const iv = req.body.encryptedData.iv;
                    const ciphertext = req.body.encryptedData.cipherText;

                    const bytes = CryptoJS.AES.decrypt(ciphertext, key, {
                        iv: iv,
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7
                    });

                    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
                    const pased_data = JSON.parse(decryptedData);
                    const receivedHash = req.headers['x-request-hash'];
                    const hash = crypto.createHash('sha256'); // hash generated from the decryoted req.body
                    hash.update(decryptedData);
                    const generatedHash = hash.digest('hex');
                    if (generatedHash === receivedHash) {
                        req.body = pased_data;
                    }
                } else {
                    const key = this.config.get('encryption:primary_key');
                    const iv = req.body.encryptedData.iv;
                    const ciphertext = req.body.encryptedData.cipherText;

                    const bytes = CryptoJS.AES.decrypt(ciphertext, key, {
                        iv: iv,
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7
                    });

                    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
                    const pased_data = JSON.parse(decryptedData);
                    const receivedHash = req.headers['x-request-hash'];
                    const hash = crypto.createHash('sha256'); // hash generated from the decryoted req.body
                    hash.update(decryptedData);
                    const generatedHash = hash.digest('hex');
                    if (generatedHash === receivedHash) {
                        console.log("hash matchedd:::::::::::::::::::::::::")
                        req.body = pased_data;
                    }
                }
            } else if(req.headers && req.headers['ocp-apim-subscription-key'] || req.url.includes('socket.io') || req.url.includes('new-env-db-setup')){
                console.log("socket/new setup ping and req: ",req.url , "===> ",req.url.includes('socket.io'))
            } else {
                console.log("body is not encryptedddddddddddddddddddddddd",req.url, req.method, req.headers['enc-flag'])
                if (!((req.headers && req.headers['enc-flag'] && req.headers['enc-flag'] === 'disable') || (req.url.includes("/login/") || req.method == 'GET'|| req.headers['form-data-flag'] == "enable"))) {
                    console.log("body is not encryptedddddddddddddddddddddddd", !(req.headers && req.headers['enc-flag'] && req.headers['enc-flag'] === 'disable') || !(req.url.includes("/login/")))
                    return res.forbidden();
                }
            }
        }
        catch (err) {
            console.log(err)
        }
        next();
    }

    async encryptionMiddleware(data) {
        try {
            let key = this.config.get('encryption:primary_key');
            const iv = CryptoJS.lib.WordArray.random(128 / 8);
            const text = JSON.stringify(data);
            const cipherText = CryptoJS.AES.encrypt(text, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            const hash = crypto.createHash('sha256'); // hash generated from the strigifird data
            hash.update(text);
            const generatedHash = hash.digest('hex');
            const encryptedData = {
                ciphertext: cipherText.toString(),
                iv: iv.toString(),
                generatedHash
            }

            return encryptedData;
        }
        catch (err) {
            console.log(err);
        }



    }

    async encryptionForLogin(dataToEncrypt) {
        try {
            const firstSecretkey = this.config.get('encryption:secondary_key'); //key that will be present on the frontend 
            const secretKey = this.config.get('encryption:primary_key'); //key that will be present on the frontend 
            // console.log("first secret ket  adn primary ey::::::::::::::::::::;", firstSecretkey, "fsuaghfiuaiugiuaefiugauf", secretKey);

            // const secretKey = "635266546A576E5A7234753778214125442A472D4B6150645367566B58703273";  // this key will be used to encypt and decrypt the data and is going to get spilted by 5 and then getting encrypted
            let secretKeyArray = [];  // splted key will be stored in this array 
            let secretKeyLength = secretKey.length;
            // let getRemainder = secretKeyLength % 5;
            let getQuotient = parseInt(secretKeyLength / 5);
            let arrayIndex = 0;

            //spliting the key and saving it in an array 
            for (let i = 0; i < secretKeyLength; i = i + getQuotient) {
                let endingIndex = i + getQuotient;
                if (secretKeyLength - i >= 2 * getQuotient) {
                    secretKeyArray[arrayIndex] = secretKey.slice(i, endingIndex);
                }
                else {
                    secretKeyArray[arrayIndex] = secretKey.slice(i, secretKeyLength);
                    break;
                }
                arrayIndex++;
            }
            // console.log(secretKeyArray);
            //generating random number which will decide weather even indexs will get enrcypted or odd indexes
            const encryptEvenOrOdd = parseInt(Math.random() * 10);
            // console.log("encryptEvenOrOdd:::::::::::::::::", encryptEvenOrOdd);

            //generated random iv which will be used in encrypting the key
            const iv = CryptoJS.lib.WordArray.random(128 / 8);
            // console.log("iv::::::::::::::;", iv.toString())

            //checking if generated ramdom number is even or odd and on the basis of that enrcyting the key
            if (encryptEvenOrOdd % 2 == 0) {
                for (let i = 0; i < secretKeyArray.length; i = i + 2) {
                    console.log("iiiiiiiiiiiiiiiiii:::::::::::::::::::::::::;;;", i);
                    if (i % 2 == 0) {
                        console.log("her is the i % 2 == ", i % 2)
                        const secretKeyParts = secretKeyArray[i];
                        // console.log(`secretKeyParts:::::::::::::::: where f/2 = 0 is ${encryptEvenOrOdd}`, secretKeyParts)
                        const cipherText = CryptoJS.AES.encrypt(secretKeyParts, firstSecretkey, {
                            iv: iv,
                            mode: CryptoJS.mode.CBC,
                            padding: CryptoJS.pad.Pkcs7
                        });
                        secretKeyArray[i] = cipherText.toString();
                    }
                }
            }
            else {
                for (let i = 1; i < secretKeyArray.length; i = i + 2) {
                    if (i % 2 !== 0) {
                        console.log("her is the i+1 % 2 == ", i + 1 % 2)
                        const secretKeyParts = secretKeyArray[i];
                        // console.log(`secretKeyParts:::::::::::::::: where f is ${encryptEvenOrOdd}`, secretKeyParts)
                        const cipherText = CryptoJS.AES.encrypt(secretKeyParts, firstSecretkey, {
                            iv: iv,
                            mode: CryptoJS.mode.CBC,
                            padding: CryptoJS.pad.Pkcs7
                        });
                        secretKeyArray[i] = cipherText.toString();
                    }
                }
            }
            // console.log(secretKeyArray);
            // secretKeyArray[5] = iv.toString();

            //encrypting the iv which is used in encyoting the key
            // function encryptIv(ivToEncrypt, iv_2) {
            const iv_2 = CryptoJS.lib.WordArray.random(128 / 8);
            const cipherText = CryptoJS.AES.encrypt(iv.toString(), firstSecretkey, {
                iv: iv_2,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            secretKeyArray[5] = cipherText.toString(); // storing the encrypted iv used to decrypt the cypher key
            // }
            secretKeyArray[6] = encryptEvenOrOdd; // it will decide either odd or even indexes will be  enxypted/decrypted

            secretKeyArray[7] = iv_2.toString(); //2nd iv which is used to encypt/decrypt the iv used for encypting/decrypting the secret key

            // secretKeyArray[8] = iv.toString() ; //2nd iv which is used to encypt the iv used in ecypting the secret key . This should be commented in production as it is the decypted form of key to check the proper functionality at frontend

            // secretKeyArray[9] = secretKey ; //2nd iv which is used to encypt the iv used in ecypting the secret key. This should be commented in production as it is the decypted form of key to check the proper functionality at frontend

            // console.log("secretKeyArray", secretKeyArray);
            const stringifiedData = JSON.stringify(dataToEncrypt);
            const cipherTextData = CryptoJS.AES.encrypt(stringifiedData, secretKey, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            return { cipherText: cipherTextData.toString(), secretKeyArray }
        }
        catch (err) {
            throw err;
        }
    }

    async encryptionRoutesWithoutLogginSessions(data) {
        try {
            // let key = this.config.get('encryption:primary_key');
            let key = '2A472D4B6150645367566B59703373367639792F423F4528482B4D6251655468576D5A7134743777217A25432646294A404E635266556A586E3272357538782F413F4428472D4B6150645367566B5970337336763979244226452948404D6251655468576D5A7134743777217A25432A462D4A614E645266556A586E3272357538782F413F4428472B4B6250655368566B5970337336763979244226452948404D635166546A576E5A7134743777217A25432A462D4A614E645267556B58703273357638782F413F4428472B4B6250655368566D597133743677397A244226452948404D635166546A576E5A7234753778214125442A462D4A614E645267556B58703273357638792F423F4528482B4B6250655368566D597133743677397A24432646294A404E635166546A576E5A7234753778214125442A472D4B6150645367556B58703273357638792F423F4528482B4D6251655468576D597133743677397A24432646294A404E635266556A586E327234753778214125442A472D4B6150645367566B59703373367638792F423F4528482B4D6251655468576D5A7134743777217A24432646294A404E635266556A586E3272357538782F413F442A472D4B6150645367566B59703373367639792442264529482B4D6251655468576D5A7134743777217A25432A462D4A614E635266556A586E3272357538782F413F';
            const iv = CryptoJS.lib.WordArray.random(128 / 8);
            const text = JSON.stringify(data);
            const cipherText = CryptoJS.AES.encrypt(text, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            const hash = crypto.createHash('sha256'); // hash generated from the strigifird data
            hash.update(text);
            const generatedHash = hash.digest('hex');
            const encryptedData = {
                ciphertext: cipherText.toString(),
                iv: iv.toString(),
                generatedHash
            }
            return encryptedData;
        }
        catch (err) {
            console.log(err);
        }
    }

}


module.exports = encryptionDecryptionHandler;
