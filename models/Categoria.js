var mongoose = require('mongoose');

var esquema = new mongoose.Schema({
    id: Number,
    nombre: String
});

};

mongoose.model('Categoria', esquema);

    
