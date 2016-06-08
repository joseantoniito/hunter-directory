var mongoose = require('mongoose');

var esquema = new mongoose.Schema({
    logo: String,
    nombre: String, 
    direccion: String, 
    descripcion: String, 
    imagenes: String, 
    videos: String,
    paginaWeb: String, 
    telefono: String,
    eMail: String,
    redesSociales: String, 
    horario: String,
    idCategoria: Number
});

mongoose.model('Distribuidor', esquema);

    
