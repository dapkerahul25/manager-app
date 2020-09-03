const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.CIPHER_KEY)
const iv = Buffer.from(process.env.CIPHER_IV)
const logger = require('./../util/logger')

exports.encryptPayload = (text) => {
    return new Promise((resolve, reject) => {
        try {
            let cipher = crypto.createCipheriv(algorithm, key, iv);
            let encrypted = cipher.update(text);
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            resolve({ payload: encrypted.toString('hex') })
        } catch (error) {
            logger.error('encryptPayload : err ' + error)
            resolve(null)
        }

    });
}

exports.decryptPayload = (text) => {
    return new Promise((resolve, reject) => {
        try {
            let encryptedText = Buffer.from(text, 'hex');
            let decipher = crypto.createDecipheriv(algorithm, key, iv);
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            resolve(JSON.parse(decrypted.toString()))
        } catch (error) {
            logger.error('decryptPayload : err ' + error)
            resolve(null)
        }
    });
}