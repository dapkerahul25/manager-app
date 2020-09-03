const EmpService = require("../services/employee");
const Auth = require('../../../midlewares/auth')

module.exports = function (app) {
    /* Get endpoint from .env config file */
    const endpoint = process.env.API_BASE;

    /* Add employee : using secure JWT authorization */
    app.post(endpoint + 'employee', Auth.checkAuth, EmpService.validateReqBody, EmpService.addEmployee)
    /* Update employee : using secure JWT authorization */
    app.put(endpoint + 'employee', Auth.checkAuth, EmpService.validateReqBody, EmpService.updateEmployee)
    /* Get all employee : using secure JWT authorization */
    app.get(endpoint + 'employee', Auth.checkAuth, EmpService.getAllEmployee)
    /* Delete employee : using secure JWT authorization */
    app.delete(endpoint + 'employee/:_id', Auth.checkAuth, EmpService.deleteEmployee)

};








