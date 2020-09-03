let mongoose = require('mongoose')

/* Manager model schema */
let Manager = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    mobile:String,
    country_code:String,
    password: String,
    address: String,
    dob: Date,
    company: String
})

/* Export the model */
module.exports = mongoose.model('manager', Manager);



