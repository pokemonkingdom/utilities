const { model, Schema } = require('mongoose');

let servidorPK = new Schema ({
    idservidor: String,
    nombreservidor: String,
    rolesStaff: Array,
    canalbienvenida: String,
    canalmessagelog: String,
    canalmodlog: String,
    canalreportes: String,
})

module.exports = model('pkserver', servidorPK);