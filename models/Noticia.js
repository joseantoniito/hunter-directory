
var mongoose = require('mongoose');

var esquema = new mongoose.Schema({
    titulo: String,
    contenido: String,
    banner: String,
    fecha: { type: Date, default: Date.now }, 
    video: { type: mongoose.Schema.Types.ObjectId, ref: 'Foto' },
    distribuidor: { type: mongoose.Schema.Types.ObjectId, ref: 'Distribuidor' },
});


mongoose.model('Noticia', esquema);


