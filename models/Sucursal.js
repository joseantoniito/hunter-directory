var mongoose = require('mongoose');

var esquema = new mongoose.Schema({
    logo: String,
    nombre: String, 
    direccion: { type: mongoose.Schema.Types.ObjectId, ref: 'Direccion' },
    descripcion: String, 
    galeria: String, 
    videos:  { type: mongoose.Schema.Types.ObjectId, ref: 'Videos'},
    web: String, 
    telefono: String,
    email: String,
    redessocial: String,
    horario: String,
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    banner: { type: mongoose.Schema.Types.ObjectId, ref: 'Banner' }
    
});

mongoose.model('Sucursal', esquema);
