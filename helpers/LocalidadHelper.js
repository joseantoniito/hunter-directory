var mongoose = require('mongoose');
var Pais = mongoose.model('Pais');



module.exports =   {
    CrearPaisDefult : function() {
        console.log("Busca Pais");
        var query = Pais.find();
        console.log("Almacena Paisi");
	  query.exec(function (err, data){
		if (err) {
            console.log("Error en consulta");
            return;
        }
		
          console.log(data);
        if (data.length <= 0)  {
            console.log("Almacena Pais into");
            var mPais = new Pais();
           mPais.nombre = "México";
           mPais.alias  = "MX";
           mPais.moneda = "MNX";
           mPais.save(function (err, data) {
                if(err){ console.log(err); }
                return data;
            });
      
        }
  	  });
    }
    
};


