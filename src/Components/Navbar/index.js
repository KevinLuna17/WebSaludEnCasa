/* eslint-disable */
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { db } from "../../firebase/firebase-config";
import useAuth from "../../Auth/useAuth";

import {
  Drawer,
  Form,
  Button,
  message,
  notification,
  Input,
  Select,
  Menu,
  Avatar,
  Image,
} from "antd";

import {
  AppstoreOutlined,
  LoginOutlined,
  UserOutlined,
  PieChartOutlined,
  ContainerOutlined,
  MailOutlined,
  LockOutlined,
  PoweroffOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";

const { SubMenu } = Menu;
const { Option } = Select;
var md5 = require("md5");
const date = new Date();
const Navbar = () => {
  const errors= {};
  const [formError, setFormError] = useState({});
  const auth = useAuth();

  const [state, setState] = useState({
    current: "mail",
    collapsed: false,
  });

  const [registrar, setRegistrar] = useState({
    nombre: "",
    correo: "",
    clave: "",
    clave2: "",
    tipo: "ADMINISTRADOR",
  });

  const [TipoUsuario, setTipoUsuario] = useState([]);

  /* Código para el reloj del portal web */
  const [dateTime, setDateTime] = useState({
    hours: date.getHours(),
    minutes: (date.getMinutes() < 10 ? "0" : "") + date.getMinutes(),
    seconds: date.getSeconds() 
  });
  useEffect(() => {
    OBTENER_TIPO_USUARIO();
    const timer = setInterval(() => {
      const date = new Date();
      setDateTime({
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds()
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  /* Termina */

  const OBTENER_TIPO_USUARIO= () =>{
    db.collection("roles")
        .where("type", "==", "WEB")
        .where("status", "==", "AC")
        .onSnapshot(SNAPSHOT_TIPO_USUARIO);
  }

  function SNAPSHOT_TIPO_USUARIO(snapshot) {
    const TIPO_USUARIOS = snapshot.docs.map((tipo) => {
      return {
        id: tipo.id,
        ...tipo.data(),
      };
    });
    //Almacenar los resultados en el estado
    setTipoUsuario(TIPO_USUARIOS);
  }

  const TIPO_USUARIO = () =>{
    return( TipoUsuario.map( (x,index) => { 
      return( 
              <Option key={index} value={x.value}>{x.label}</Option>
      )} ));
  }

  const openNotificationWithIcon = (type, Mensaje) => {
    notification[type]({
      message: "Solicitud de registro",
      description: Mensaje,
    });
  };

  const handlechange = (e, estado) => {
    console.log(e);
    setRegistrar({
      ...registrar,
      [estado]: e.target.value,
    });
  };

  const handleTipo = (value) => {
    setRegistrar({
      ...registrar,
      tipo: value,
    });
  };

  const handleRegistar = async () => {
    if (ValidarRegistro()) {
      db.collection("usuarios")
        .add({
          contraseña: md5(registrar.clave),
          correo: registrar.correo,
          nombre: registrar.nombre,
          tipouser: registrar.tipo,
          createAt: new Date(),
          //createBy: "INACTIVO",
          createBy: registrar.tipo,
          estado: "DC",
        })
        .then(() => {
          openNotificationWithIcon(
            "success",
            "Se envió la solicitud de registro, espere hasta que el administrador acepte su solicitud."
          );
          showDrawer();
        })
        .catch(() => {
          openNotificationWithIcon(
            "error",
            "No se pudo enviar la solicitud de registro, intente más tarde"
          );
        });
    }
  };

  const ValidarRegistro = () => {
    if (ValidarNombre() && ValidarCorreo() && ValidarClave()) {
      return true;
    }
    setFormError(errors);
    return false;
  };

  const ValidarNombre = () => {
    let valoresAceptados =
    /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(?: [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)+$/;
    if (registrar.nombre === "" || registrar.nombre === null) {
      errors.nombre=true;
      message.warning("Ingrese el nombre de usuario");
      return false;
    }
    if (!registrar.nombre.match(valoresAceptados)) {
      errors.nombre=true;
      message.warning("Debe ingresar al menos un nombre y un apellido");
      return false;
    }
    return true;
  };


  const ValidarCorreo = () => {
    let valoresAceptados =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (registrar.correo === "" || registrar.correo === null) {
      errors.correo=true;
      message.warning("Ingrese un correo electrónico");
      return false;
    }
    if (!registrar.correo.match(valoresAceptados)) {
      errors.correo=true;
      message.warning("El correo electrónico es incorrecto");
      return false;
    }
    return true;
  };

  const ValidarClave = () => {
    let valoresAceptados =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?_&-])([A-Za-z\d$@$!%*?_&-]|[^ ]){8,12}$/
    if (registrar.clave !== registrar.clave2) {
      errors.clave=true;
      errors.clave2=true;
      message.warning("Las contraseñas no coinciden");
      return false;
    }
    if (!registrar.clave.match(valoresAceptados)) {
      //errors.clave=true;
      message.warning("Su contraseña no cumple con las políticas");
      return false;
    }
    return true;
  };

  const [visible, setVisible] = React.useState(false);

  const { current } = state;

  const handleClick = (e) => {
    console.log("click ", e);
    setState({
      ...state,
      current: e.key,
    });
  };

  const showDrawer = () => {
    setVisible(!visible);
  };

  return (
    <>
      <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
        {!auth.isLogged() && (
          <>
            <Menu.Item key="Login" icon={<LoginOutlined />}>
              <NavLink exact to="/login" activeClass="active">
                Iniciar Sesión
              </NavLink>
            </Menu.Item>
            <Menu.Item
              onClick={showDrawer}
              key="Register"
              icon={<AppstoreOutlined />}
            >
              Registrar
            </Menu.Item>
          </>
        )}

        {auth.isLogged() && (
          <>
            <Menu.Item key="Home" icon={<MailOutlined />} style={{ marginLeft: "45px" }}>
              <NavLink exact to="/">
                Inicio
              </NavLink>
            </Menu.Item>

            <Menu.Item key="Hora" icon={<FieldTimeOutlined />}>
              {dateTime.hours}:{dateTime.minutes}:{dateTime.seconds}
            </Menu.Item>

            <Menu.Item key="Logout" style={{ position:'absolute', right:0}}>
              <Button onClick={auth.logout} type="primary" icon={<PoweroffOutlined />}>
                Cerrar Sesión
              </Button>
            </Menu.Item>

          </>
        )}
      </Menu>
      {auth.isLogged() && (
        <div style={{ float: "left", marginRight: "30px" }}>
          <center>
            <Image
              width={150}
              src="https://firebasestorage.googleapis.com/v0/b/saludencasa-fb2c7.appspot.com/o/serviciosmedicos%2FLOGO_WEB.png?alt=media&token=c898710a-b771-4396-b8b7-c90e15dc48e8"
            />
          </center>
          <Menu
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            theme="ligth"
            inlineCollapsed={state.collapsed}
          >
            <Menu.Item key="1" icon={<PieChartOutlined />}>
              <NavLink exact to="/reporte">
                Reportes
              </NavLink>
            </Menu.Item>
            <Menu.Item key="2" icon={<UserOutlined />}>
              <NavLink exact to="/usuarios">
                Auditoría
              </NavLink>
            </Menu.Item>
            <Menu.Item key="3" icon={<ContainerOutlined />}>
              <NavLink exact to="/solicitudes">
                Solicitudes
              </NavLink>
            </Menu.Item>
            <SubMenu key="sub1" icon={<MailOutlined />} title="Administración">
              <Menu.Item key="5">
                <NavLink exact to="/servicios">
                  Servicios médicos
                </NavLink>
              </Menu.Item>
              {
                auth.typeUser() == 'ADMINISTRADOR' && (
                  <Menu.Item key="6">
                    <NavLink exact to="/AdminUsuarios">
                      Usuarios
                    </NavLink>
                  </Menu.Item>
                )
              }
              
            </SubMenu>
          </Menu>
        </div>
      )}
      <Drawer
        title="Crea una cuenta nueva"
        style={{
          textAlign: "center",
        }}
        width={700}
        onClose={showDrawer}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              marginTop:"40px",
              marginBottom: "40px",
              textAlign: "center",
            }}
          >
            <Button onClick={showDrawer} style={{ marginRight: 40, width: "30%" }}>
              Cancelar
            </Button>
            <Button onClick={handleRegistar} type="primary" style={{  width: "30%" }}>
              Registrar
            </Button>
          </div>
        }
      >
        <Form
        style={{marginTop: 20, marginRight: 80}}
          name="basic"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 20,
          }}
          initialValues={{
            remember: true,
          }}
          autoComplete="off"
        >
          <Form.Item label="Nombre" name="Nombre" style={{ fontWeight: "bold"}}>
            <Input
            style={ formError.nombre && {borderColor: "#CC0000"}}
              placeholder="Ingrese su nombre"
              onChange={(e) => handlechange(e, "nombre")}
            />
          </Form.Item>

          <Form.Item label="Correo electrónico" name="Correo" style={{marginTop: 30, fontWeight: "bold"}}>
            <Input
            prefix={<UserOutlined />}
            type="email"
            style={ formError.correo && {borderColor: "#CC0000"}}
              placeholder="Ingrese su correo electrónico"
              onChange={(e) => handlechange(e, "correo")}
            />
          </Form.Item>

          <Form.Item label="Contraseña" name="Contraseña" style={{marginTop: 30, fontWeight: "bold"}}>
            <Input.Password
             prefix={<LockOutlined />}
             type="password"
             style={ formError.clave && {borderColor: "#CC0000"}}
              placeholder="Ingrese la contraseña"
              onChange={(e) => handlechange(e, "clave")}
            />
          </Form.Item>

          <Form.Item label="Repetir contraseña" name="Contraseña2" style={{marginTop: 30, fontWeight: "bold"}}>
            <Input.Password
             prefix={<LockOutlined />}
             type="password"
             style={ formError.clave2 && {borderColor: "#CC0000"}}
              placeholder="Ingrese de nuevo la contraseña"
              onChange={(e) => handlechange(e, "clave2")}
            />
          </Form.Item>

          <Form.Item label="Tipo" name="Tipo" style={{marginTop: 30, fontWeight: "bold"}}>
            <Select
              defaultValue="ADMINISTRADOR"
              style={{ fontWeight: "normal", width: "100%" }}
              onChange={handleTipo}
            >
              {/* <Option value="ADMINISTRADOR">ADMINISTRADOR</Option>
              <Option value="SECRETARIA">SECRETARIA</Option> */}
              {TIPO_USUARIO()}
            </Select>
          </Form.Item>
        </Form>

        <div>
        <p style={{textAlign: "center", fontWeight: "bold", marginTop: "4rem", marginLeft: "2rem"}}>Política de seguridad de contraseñas</p>
        <span style={{ textAlign: "left", }}>
        <li style={{marginLeft: 67, marginTop:"0.6rem" }}>Debe incluir al menos una letra mayúscula</li>
        <li style={{marginLeft: 67, marginTop:"0.6rem" }}>Debe incluir un carácter especial</li>
        <li style={{marginLeft: 67, marginTop:"0.6rem" }}>Debe incluir de 8 a 12 caracteres</li>
        </span>
        </div>
        
      </Drawer>
    </>
  );
};

export default Navbar;
