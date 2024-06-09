const { model, Schema } = require('mongoose');

let rolesStaff = new Schema ({
    Monarca: String,
    Duque: String,
    ConsejeroReal: String,
    GuardaReal: String,
    EscuderoReal: String,
    BufonReal: String,
})

module.exports = model('rolestaff', rolesStaff);