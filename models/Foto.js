var mongoose = require('mongoose');

var esquema = new mongoose.Schema({
    url: String,
    fecha: Date,
    descripcion: String,
    evento: { type: mongoose.Schema.Types.ObjectId, ref: 'Foto' }
});

mongoose.model('Foto', esquema);

    
