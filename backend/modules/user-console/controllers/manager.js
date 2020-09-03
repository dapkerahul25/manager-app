const MngrService = require("../services/manager");

module.exports = function (app) {
    /* Get endpoint from .env config file */
    const endpoint = process.env.API_BASE;

    /* Sign up manager */
    app.post(endpoint + 'signup', MngrService.validateReqBody, MngrService.userSignUp)
    /* Sign in manager */
    app.post(endpoint + 'signin', MngrService.userSignIn)

};








