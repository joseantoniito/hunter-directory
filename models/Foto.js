var mongoose = require('mongoose');

var esquema = new mongoose.Schema({
    url: String,
    fecha: { type: Date, default: Date.now },
    descripcion: String
});

mongoose.model('Foto', esquema);

    
