async function EnviarCorreo(Titulo,Correo,Asunto){
    const UrlApi ='https://proyectoisoo.000webhostapp.com/API_CORREOS/procedures/get_methods/EnviarCorreo.php?token=015ec0d618fe3fa9c7d0a1abda2b159c&Titulo='+Titulo+'&Correo='+Correo+'&Asunto='+Asunto;
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
export{EnviarCorreo};