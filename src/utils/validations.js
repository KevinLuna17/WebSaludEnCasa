export function validateEmail(correo) {
    let valoresAceptados =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return valoresAceptados.test(correo); //Devuelve false cuando el formato de email es invalido
  }

  export function validateContrasena(clave) {
     let valoresAceptados =
     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?_&-])([A-Za-z\d$@$!%*?_&-]|[^ ]){8,12}$/
      
    return valoresAceptados.test(clave); //Devuelve false cuando el formato de password es invalido
  }

  export function validateNombre(nombre) {
    let valoresAceptados =
    /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(?: [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)$/;
     
   return valoresAceptados.test(nombre); //Devuelve false cuando el formato de password es invalido
 }