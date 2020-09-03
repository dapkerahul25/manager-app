const Manager = require('../models/manager')
const Common = require('./../../../util/common')
const Moment = require('moment')
const logger = require('./../../../util/logger')

module.exports = {
    /* Manager sign up */
    userSignUp: async (req, res) => {
        try {
            req.body.dob = Moment(req.body.dob).format("YYYY-MM-DD")
            req.body.password = await Common.bcryptHash(req.body.password)
            let manager = await Manager.findOne({
                $or: [
                    { email: req.body.email },
                    { mobile: req.body.mobile }
                ]
            }).exec();
            if (!manager) {
                manager = await new Manager(req.body).save();
                if (!manager) {
                    return res.status(400).json({ message: "User sign up failed!" });
                }
                manager = await Manager.findOne({ email: req.body.email, mobile: req.body.mobile });
                return res.status(200).json({
                    success: true,
                    message: 'Signed up successfully'
                })
            } else {
                return res.status(201).json({ status_code: 201, message: `Email or Mobile already exist!` });
            }

        } catch (error) {
            logger.error('manager service userSignUp err :' + error)
            return res.status(500).json({ success: false, message: 'Error!', errors: error })
        }
    },

    /* Manager sign in */
    userSignIn: async (req, res) => {
        try {
            if (!req.body) {
                return res.status(400).json({ success: false, message: `Invalid request!` })
            } else if (!req.body.username) {
                return res.status(400).json({ success: false, message: `Username required!` })
            } else if (!req.body.password) {
                return res.status(400).json({ success: false, message: `Password required!` })
            }
            let manager = await Manager.findOne({
                $or: [
                    { email: req.body.username },
                    { mobile: req.body.username }
                ]
            }).exec();
            if (!manager) {
                return res.status(401).json({ message: `Login Failed : Incorrect Email or Password!!` });
            }
            let token = await Common.jwtGenToken(req.body, manager)
            if (!token) {
                return res.status(401).json({ message: `Login Failed : Incorrect Email or Password!!` });
            }
            let loginData = {
                user_id: manager._id,
                firstname: manager.firstname,
                lastname: manager.lastname,
                mobile: manager.mobile,
                email: manager.email,
                company: manager.company,
                address: manager.address,
                dob: manager.dob,
                token: token
            }
            return res.status(200).json({
                success: true,
                message: 'Signed in successfully',
                data: loginData
            })

        } catch (error) {
            logger.error('manager service userSignIn err :' + error)
            return res.status(500).json({ success: false, message: 'Error!', errors: error })
        }
    },

    /* Validate manager req body */
    validateReqBody: async (req, res, next) => {
        try {
            if (!req.body) {
                return res.status(400).json({ success: false, message: ` Invalid request!` })
            } else if (!req.body.firstname) {
                return res.status(400).json({ success: false, message: ` First name required!` })
            } else if (!req.body.lastname) {
                return res.status(400).json({ success: false, message: ` Last name required!` })
            } else if (!req.body.password) {
                return res.status(400).json({ success: false, message: ` Password required!` })
            } else if (!req.body.address) {
                return res.status(400).json({ success: false, message: ` Address required!` })
            } else if (!req.body.company) {
                return res.status(400).json({ success: false, message: ` Company required!` })
            } else if (!req.body.mobile) {
                return res.status(400).json({ success: false, message: ` Mobile no required!` })
            } else if (!req.body.email) {
                return res.status(400).json({ success: false, message: ` Email required!` })
            } else if (!req.body.dob) {
                return res.status(400).json({ success: false, message: ` Date of birth required!` })
            } else {
                req.body.firstname = await Common.capitalizeFirstLetter(req.body.firstname)
                req.body.lastname = await Common.capitalizeFirstLetter(req.body.lastname)
                next()
            }

        } catch (error) {
            logger.error('manager service validateReqBody err :' + error)
            return res.status(500).json({ success: false, message: 'Error!', errors: error })
        }
    }
}