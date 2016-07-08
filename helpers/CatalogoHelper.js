var mongoose = require('mongoose');

var esquema = new mongoose.Schema({
    id: Number,
    nombre: String,
    descripcionCorta : String,
    descripcion: String
});

module.exports  = {
    crearCatalogo : function(nombreCatalogo) {
        mongoose.model(nombreCatalogo, esquema);    
    }
};


