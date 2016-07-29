var mongoose = require('mongoose');

var esquema = new mongoose.Schema({
    logo: String,
    nombre: String, 
    //direccion: String, 
    descripcion: String, 
    imagenes: String, 
    videos: String,
    paginaWeb: String, 
    telefono: String,
    eMail: String,
    redesSociales: String, 
    horario: String,
    idCategoria: Number,
    direccion: { type: mongoose.Schema.Types.ObjectId, ref: 'Direccion' },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    usuarioPadre: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    idTipo: Number,
    banner: String
});

mongoose.model('Distribuidor', esquema);