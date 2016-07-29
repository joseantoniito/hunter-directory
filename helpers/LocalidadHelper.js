var mongoose = require('mongoose');
var Pais = mongoose.model('Pais');



module.exports =   {
    CrearPaisDefult : function() {
        
      var query = Pais.find();
      
	  query.exec(function (err, data){
		if (err) {
            console.log("Error en consulta");
            return;
        }
		
        if (data.length <= 0)  {
          
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


