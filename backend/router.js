module.exports = (app) => {
    /* API Route to manager controller */
    require('./modules/user-console/controllers/manager')(app)
    /* API Route to employee controller */
    require('./modules/user-console/controllers/employee')(app)
}