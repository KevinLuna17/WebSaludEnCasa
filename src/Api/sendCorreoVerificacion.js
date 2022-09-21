async function EnviarCorreoVerificacion(Titulo,Correo,Asunto,Codigo){
    const UrlApi ='https://proyectoisoo.000webhostapp.com/API_CORREOS/procedures/get_methods/EnviarCodigoVerificacion.php?token=015ec0d618fe3fa9c7d0a1abda2b159c&Titulo='+Titulo+'&Correo='+Correo+'&Asunto='+Asunto+"&Codigo="+Codigo;
        try{
            let response= await fetch(UrlApi);
            // let  res= await response.message;
            let responseJson= await response.json();
            let res= await responseJson.body;
            // console.log(JSON.stringify(responseJson.body));
            return res;
        }catch(error){
            console.error(`ERROR AL ENVIAR CORREO :  ${error}`)
        }
}
export{EnviarCorreoVerificacion};