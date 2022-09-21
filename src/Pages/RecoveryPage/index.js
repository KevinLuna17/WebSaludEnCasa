import React from "react";
import { Steps, Button, message , Input  } from 'antd';
import { makeStyles } from "@material-ui/core/styles";
import { EnviarCorreoVerificacion } from '../../Api/sendCorreoVerificacion';
import { db } from "../../firebase/firebase-config";
import { useHistory } from "react-router-dom";
const { Step } = Steps;
var md5 = require("md5");
const RecoveryPage = () => {
    const history = useHistory();
    const style = useStyles();
    const [current, setCurrent] = React.useState(0);

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const [state, setState] = React.useState({
        correo:"",
        nuevaClave: "",
        repetirClave: "",
        codigo:""
    });

    const [codigo , setCodigo] = React.useState("")
    const [id , setId] = React.useState("")

    const handlechange = (e, estado) => {
        console.log(e);
        setState({
        ...state,
            [estado]: e.target.value,
        });
    };

    const ValidarClave = () => {
        let valoresAceptados = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?_&-])([A-Za-z\d$@$!%*?_&-]|[^ ]){8,12}$/
        if (state.nuevaClave !== state.repetirClave) {
            message.warning("Las contraseñas no coinciden");
            return false;
        }
        if (!state.nuevaClave.match(valoresAceptados)) {
            message.warning("Su contraseña no cumple con las políticas");
            return false;
        }
        return true;
    };

    const ValidarCorreo = () => {
        let valoresAceptados = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (!state.correo.match(valoresAceptados)) {
            message.warning("Su correo electrónico no cumple con las políticas");
            return false;
        }
        return true;
    };

    
    const steps = [
        {
            title: 'Enviar código de verificación',
            content: 
                <>
                    <h3>Se enviará un código de verificación de 5 dígitos a su cuenta, por favor revise su correo electrónico</h3>
                    <Input value={state.correo}  name="correo" onChange={(e) => handlechange(e, "correo")} placeholder="Ingrese su correo" style={{width: '300px'}} />
                </>,
        },
        {
            title: 'Validación',
            content: 
                <>
                    <h3>Ingrese el código de verificación</h3>
                    <Input value={state.codigo} name="codigo" onChange={(e) => handlechange(e, "codigo")} style={{width: '300px'}} />
                </>,
        },
        {
            title: 'Nueva contraseña',
            content: 
                <div style={{
                        marginBottom: '50px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    <h3 style={{width: '300px',textAlign: 'left'}}>Ingrese una contraseña nueva</h3>
                    <Input.Password style={{width: '300px',textAlign: 'left'}} onChange={(e) => handlechange(e, "nuevaClave")} placeholder="Nueva contraseña" />
                    <h3 style={{width: '300px',textAlign: 'left'}}>Repita la contraseña</h3>
                    <Input.Password style={{width: '300px',textAlign: 'left'}} onChange={(e) => handlechange(e, "repetirClave")} placeholder="Repetir contraseña" />
                </div>,
        },
    ];

    function randomNumber(min, max){
        const r = Math.random()*(max-min) + min
        return Math.floor(r)
    }

    const handleEnviarCodigo = async () =>{

        if(ValidarCorreo()){
            GUARDAR_ID();
            let Codigo = "";
            for (var i = 0; i < 5; i++) {
                Codigo = Codigo + randomNumber(0, 10);
            }
            setCodigo(Codigo)
            await EnviarCorreoVerificacion('SALUD EN CASA',state.correo,'CÓDIGO DE VERIFICACIÓN',Codigo);
            next();
        }
        
    }
    
    const GUARDAR_ID = async () =>{
        let querySnapshot = "";
        let Docs = [];
        querySnapshot = await db
            .collection("usuarios")
            .where("correo", "==" , state.correo)
            .get();
        querySnapshot.forEach((doc) => {
            Docs.push({id: doc.id });
        });
        setId(Docs[0])
    }

    const handleValidarCodigo = () =>{
        if(state.codigo === codigo){
            message.success('El código es correcto')
            next();
        }else{
            message.error('El código no es correcto')
            return
        }
    }

    const handleValidarClave = () =>{
        if(
            ValidarClave()
        ){
            //ACTUALIZAR LA CONTRASEÑA FIREBASE
            db.collection("usuarios")
                .doc(id.id)
                .update({
                    contraseña: md5(state.nuevaClave),
                })
                .then(() => {
                    message.success("Su contraseña ha sido actualizada");
                    history.push("/login");
                })
                .catch(() => {
                    message.error("No se pudo actualizar su contraseña, por favor intente más tarde");
                });
        }
    }
    

    return (
        <div className={style.contenedor }>
        <Steps current={current}>
            {steps.map(item => (
            <Step key={item.title} title={item.title} />
            ))}
        </Steps>
        <div className={style.stepsContent }>{steps[current].content}</div>
        <div className={style.stepsAction }>
            {current == steps.length - 3 && (
                
            <Button type="primary" onClick={handleEnviarCodigo}>
                Enviar
            </Button>

            )}
            {current == steps.length - 2 && (
                
                <Button type="primary"  onClick={handleValidarCodigo}>
                    Validar
                </Button>
    
            )}
            {current === steps.length - 1 && (
            <Button type="primary" onClick={handleValidarClave}>
                Terminar
            </Button>
            )}
            {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                Retroceder
            </Button>
            )}
        </div>
        </div>
    );
};
export default RecoveryPage;

const useStyles = makeStyles((theme) => ({
    contenedor:{
        margin: '50px'
    },
    stepsContent:{
        minHeight: '200px',
        marginTop: '16px',
        paddingTop: '80px',
        textAlign: 'center',
        backgroundColor: '#fafafa',
        border: '1px dashed #e9e9e9',
        borderRadius: '2px'
    },
    stepsAction:{
        marginTop:'24px'
    }
}));
