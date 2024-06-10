const { model, Schema } = require('mongoose');

let servidorPKStaff = new Schema ({
    idservidor: String,
    nombreservidor: String,
    rolesStaff: Array,
    canallogs: String,
    modlog: String,
})

module.exports = model('pkstaffserver', servidorPKStaff);