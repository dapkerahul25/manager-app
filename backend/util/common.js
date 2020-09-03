const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const saltRounds = Number(process.env.BCRYPT_SALT_ROUND)
const EncryptObj = require('./encrypt')
const privateKEY = process.env.PRIVATE_KEY
const logger = require('./../util/logger')

/* Generate token on sign in */
exports.jwtGenToken = (reqData, userData) => {
    return new Promise((resolve, reject) => {
        try {
            bcrypt.compare(reqData.password, userData.password).then(async (result) => {
                if (result) {
                    let payload = await EncryptObj.encryptPayload(JSON.stringify({ 'user_id': userData._id }))
                    const token = await jwt.sign(payload, privateKEY, { expiresIn: 86400 });
                    resolve(token)
                }
                else {
                    logger.error(`jwtGenToken : authentication failed. Password doesn't match`)
                    resolve(false)
                }
            })
                .catch((err) => {
                    logger.error('jwtGenToken : Exception occurred while jwt token generation Error :' + err)
                    resolve(false)
                })
        } catch (error) {
            logger.error('jwtGenToken : Exception occurred while jwt token generation Error : ' + error)
            resolve(false)
        }

    })

}

/* Convert plain password to hash password */
exports.bcryptHash = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                logger.error('bcryptHash : Error occcurred while password hashing process! Error :' + err)
                reject(false)
            } else if (hash) {
                resolve(hash)
            }
        })
    })

}

/* Uppercase first letter of string */
exports.capitalizeFirstLetter = (string) => {
    return new Promise((resolve, reject) => {
        try {
            resolve(string.charAt(0).toUpperCase() + string.slice(1))
        } catch (error) {
            resolve(string)
        }
    })
}


