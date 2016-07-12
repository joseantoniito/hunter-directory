
var mongoose = require('mongoose');

var esquema = new mongoose.Schema({
    id: Number,
    calle : String,
    numero_interior : String,
    numero_exterior : String,
    pais : String,
    estado : String,
    municipio: String,
    entreCalleUno : String,
    entreCalleDos : String,
    latitud : String,
    longitud : String    
});


mongoose.model('Direccion', esquema);


