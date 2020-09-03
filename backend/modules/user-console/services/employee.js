const Employee = require('../models/employee')
const Moment = require('moment')
const Common = require('./../../../util/common')
const logger = require("./../../../util/logger");

module.exports = {
    /* Add employee */
    addEmployee: async (req, res) => {
        try {
            req.body.dob = Moment(req.body.dob).format("YYYY-MM-DD")
            let employee = await Employee.findOne({
                mobile: req.body.mobile,
            }).exec();
            if (employee) {
                return res.status(201).json({ status_code: 201, message: `Mobile already exist!` });
            }
            req.body.manager_id = req.tokenData.user_id
            employee = await new Employee(req.body).save();
            if (!employee) {
                return res.status(400).json({ message: "Employee save failed!" });
            }
            return res.status(200).json({
                success: true,
                message: 'Employee saved successfully'
            })
        } catch (error) {
            logger.error('employee service addEmployee err :' + error)
            return res.status(500).json({ success: false, message: 'Error!', errors: error })
        }
    },

    /* Update emplyee by _id */
    updateEmployee: async (req, res) => {
        try {
            if (!req.body._id) {
                return res.status(400).json({ success: false, message: `Employee user id is required!` })
            }
            req.body.dob = Moment(req.body.dob).format("YYYY-MM-DD")
            let employee = await Employee.findOne({ _id: req.body._id }).exec();
            if (!employee) {
                return res.status(403).json({ message: `Employee not exist!` });
            }
            employee = await Employee.findOneAndUpdate({ _id: employee._id },
                {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    emp_id: req.body.emp_id,
                    address: req.body.address,
                    city: req.body.city,
                    mobile: req.body.mobile,
                    dob: req.body.dob
                });
            if (!employee) {
                return res.status(400).json({ message: "Employee update failed!" });
            }
            return res.status(200).json({
                success: true,
                message: 'Employee updated successfully'
            })
        } catch (error) {
            logger.error('employee service updateEmployee err :' + error)
            return res.status(500).json({ success: false, message: 'Error!', errors: error })
        }
    },

    /* Get all employee by manager id */
    getAllEmployee: async (req, res) => {
        try {
            const employee = await Employee.find({ manager_id: req.tokenData.user_id }).sort('firstname').exec()
            if (!employee) {
                return res.status(400).json({ message: "Employee not found!" });
            }
            return res.status(200).json({
                success: true,
                message: 'Employee get successfully',
                data: employee
            })
        } catch (error) {
            logger.error('employee service getAllEmployee err :' + error)
            return res.status(500).json({ success: false, message: 'Error!', errors: error })
        }
    },

    /* Delete employee by _id */
    deleteEmployee: async (req, res) => {
        try {
            if (!req.params._id) {
                return res.status(400).json({ success: false, message: `Employee user id is reuired!` })
            }
            const employee = await Employee.deleteOne({ _id: req.params._id });
            if (!employee) {
                return res.status(400).json({ message: "Employee not found!" });
            }
            return res.status(200).json({
                success: true,
                message: 'Employee deleted successfully'
            })
        } catch (error) {
            logger.error('employee service deleteEmployee err :' + error)
            return res.status(500).json({ success: false, message: 'Error!', errors: error })
        }
    },

    /* Validate emplyee req body */
    validateReqBody: async (req, res, next) => {
        try {
            if (!req.body) {
                return res.status(400).json({ success: false, message: `Invalid request!` })
            } else if (!req.body.firstname) {
                return res.status(400).json({ success: false, message: `First name required!` })
            } else if (!req.body.lastname) {
                return res.status(400).json({ success: false, message: `Last name required!` })
            } else if (!req.body.emp_id) {
                return res.status(400).json({ success: false, message: `Employee id required!` })
            } else if (!req.body.address) {
                return res.status(400).json({ success: false, message: `Address required!` })
            } else if (!req.body.city) {
                return res.status(400).json({ success: false, message: `City required!` })
            } else if (!req.body.mobile) {
                return res.status(400).json({ success: false, message: `Mobile no required!` })
            } else if (!req.body.country_code) {
                return res.status(400).json({ success: false, message: `Country code required!` })
            } else if (!req.body.dob) {
                return res.status(400).json({ success: false, message: `Date of birth required!` })
            } else {
                req.body.firstname = await Common.capitalizeFirstLetter(req.body.firstname)
                req.body.lastname = await Common.capitalizeFirstLetter(req.body.lastname)
                next()
            }

        } catch (error) {
            logger.error('employee service validateReqBody err :' + error)
            return res.status(500).json({ success: false, message: 'Error!', errors: error })
        }
    }
}