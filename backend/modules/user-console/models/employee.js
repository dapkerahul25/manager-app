let mongoose = require('mongoose')

/* Employee model schema */
let Employee = new mongoose.Schema({
    manager_id: String,
    firstname: String,
    lastname: String,
    emp_id: String,
    address: String,
    dob: String,
    mobile: String,
    country_code: String,
    city: String
})

/* Export the model */
module.exports = mongoose.model('employee', Employee);



