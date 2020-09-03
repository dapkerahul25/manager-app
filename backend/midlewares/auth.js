const jwt = require('jsonwebtoken')
const privateKEY = process.env.PRIVATE_KEY
const CipherObj = require('../util/encrypt')
const logger = require("../util/logger");

module.exports = {
    /* Handling endpoint authorization using JWT Token */
    checkAuth: async (req, res, next) => {
        try {
            if (req.header("authorization")) {
                let decoded = await jwt.verify(req.header("authorization"), privateKEY)
                if (decoded && typeof (decoded.payload) === 'string') {
                    let tokenDecryptData = await CipherObj.decryptPayload(decoded.payload)
                    if (tokenDecryptData && tokenDecryptData.user_id) {
                        req.tokenData = { 'user_id': tokenDecryptData.user_id }
                    } else {
                        logger.warn('Unauthorized user')
                        return res.status(401).json({ message: "Unauthorized user" });
                    }
                    next();
                } else {
                    logger.warn('Unauthorized. Token encryption not verified! || Error : ' + err.toString());
                    return res.status(401).json({ message: "Unauthorized.Token encryption not verified!", errors: err });
                }
            } else {
                logger.warn('Unauthorized.Missing Auth Headers!');
                return res.status(401).json({ message: "Unauthorized.Missing Auth Headers" });
            }

        } catch (error) {
            logger.warn('JWT Error : ' + error);
            return res.status(401).json({ message: error.message, errors: error });
        }
    }
};