import React , {useEffect,useState} from 'react'
import mision from "../../../src/img/logo-mision.png";
import vision from "../../../src/img/vision.png";
import "./homePage.css"
import { Badge } from 'antd';


const HomePage = () => {
    const [state,setState] = useState({
        correo:'',
        tipouser:'',
        nombre:''
    })
    
    useEffect(()=>{
        const getUsuarios = async () => {

            const usuario = JSON.parse(localStorage.getItem('User'))
            if(usuario!==null || usuario!==undefined){
                console.log(usuario.correo)
                setState({
                    ...state,
                    correo:usuario.correo,
                    tipouser:usuario.tipouser,
                    nombre:usuario.nombre
                })
            }
    
        }
        getUsuarios()
    },[])
    return (
        <>

            <div style={{padding:'50px'}}>
                <p style={{fontSize:'25px',marginBottom:'0px'}}><span style={{fontSize:'40px', fontWigth:'bold'}}>Hola, </span>{state.nombre}</p>
                
                <Badge
                    className="site-badge-count-109"
                    count={state.tipouser}
                    style={{ backgroundColor: '#52c41a' }}
                />
            </div>

            <div className='container'>
            <div className='card'>
            <h1 style={{ fontSize: 48, textAlign: "center"}}>
            Visión
            </h1>
            <center><img className='img' src={vision} alt=""/></center>
            <p className='parrafo'>
            La organización será líder en proveer servicios médicos a domicilio a los habitantes de Guayaquil, gracias al aporte y profesionalismo de sus colaboradores.
            </p>
            </div>

            <div className='card'>
            <h1 style={{ fontSize: 48, textAlign: "center"}}>
            Misión
            </h1>
            <center><img className='img' src={mision} alt=""/></center>
            <p className='parrafo'>
            Proveer servicios médicos de excelencia a los habitantes de la ciudad de Guayaquil manejando altos estándares de calidad.
            </p>
            </div>
            </div>
 
            
        </>
    )
}

export default HomePage