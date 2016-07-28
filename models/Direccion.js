
var mongoose = require('mongoose');

var esquema = new mongoose.Schema({
    id: Number,
    calle : String,
    numero_interior : String,
    numero_exterior : String,
    colonia: String,
    municipio: String,
    estado : String,
    pais : String,
    entreCalleUno : String,
    entreCalleDos : String,
    latitud : String,
    longitud : String,
    codigoPostal: String,
    telefono: String,
    celular: String
});


mongoose.model('Direccion', esquema);


