var UserHelper = {
isUserExists : function(user,isValid, error) {
    
    if (!user) {
        error("Usuario ya existe");
        return;
    }
    
    isValid(user);
    
},

 isDataOk : function(user,isValid,error) {
    if (!user) {
        error("Usuario no contiene la información requerida");
        return;
    }
         
    if (!user.name) {
        error("El nombre no puede estar vacio");
        return;
    } 
      
    if (!user.password) {
        error("La contrasña no puede estar vacia");
        return;
    } 
      
    if (user.password.length < 5 ) {
        error("La contrasña debe de ser mayor o igual a 5 caracteres");
        return;
    } 
        
    if (!user.email) {
        error("El email no puede estar vacio");
        return;
    }
        
    if (user.email !== user.email_confirm) {
        error("El email es diferente");
        return;
    }
        
    if (!user.tipo) {
        error("Seleccione tipo de usuario");
        return;
    }
            
         
    this.isUserExists(user,isValid,error);
 },

    isUserValid : function(user, isValid, error) {
        this.isDataOk(user,isValid,error);
    }
}


module.exports = UserHelper;