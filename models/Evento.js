var mongoose = require('mongoose');

var esquema = new mongoose.Schema({
    nombre: String, 
    descripcion: String,
    direccion: String, 
    fechaInicio: Date, 
    fechaFin: Date, 
    banner: String,
    fotos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Foto' }],
    idUsuario: { type: mongoose.Schema.Types.ObjectId }
});

mongoose.model('Evento', esquema);

    
