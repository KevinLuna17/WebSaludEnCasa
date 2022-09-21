import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import useAuth from "../../Auth/useAuth";
import logo from "../../../src/img/logo.png";
import { validateEmail, validateContrasena } from "../../utils/validations";
import { makeStyles } from "@material-ui/core/styles";
import { Form, Input, Button, Checkbox, message } from "antd";
import "antd/dist/antd.css";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { db } from "../../firebase/firebase-config";
import "./login.css"



var md5 = require("md5");

const LoginPage = () => {
  const style = useStyles();
  const [formError, setFormError] = useState({});
  const location = useLocation();
  const history = useHistory();
  const auth = useAuth();
  const PreviusUrl = location.state?.from;

  const [state, setState] = useState({
    correo: "",
    clave: "",
  });

  const handlechange = (e, estado) => {
    console.log(e);
    setState({
      ...state,
      [estado]: e.target.value,
    });
  };

  const getLogin = async () => {
    const Clave = md5(state.clave);
    const querySnapshot = await db
      .collection("usuarios")
      .where("correo", "==", state.correo)
      .where("contraseña", "==", Clave)
      .where("estado", "==", "AC")
      .get();
    const Docs = [];
    console.log(querySnapshot);
    querySnapshot.forEach((doc) => {
      Docs.push({ ...doc.data(), id: doc.id });
    });
    if (Docs.length > 0) {
      return Docs[0];
    }

    return false;
  };


  const handleLogin = async () => {
    let errors = {};
    //if (ValidarLogin()) {
    const Datos = await getLogin();
    if (Datos !== false) {
      auth.login(Datos);
      history.push(PreviusUrl || "/");
    } else if ((state.correo === "" || state.correo === null ) && (state.clave === "" || state.clave === null)) {
      errors.correo=true;
      errors.clave=true;
      message.warning("Todos los campos son requeridos");
      //return false;
    } else if ((state.correo !== "" || state.correo !== null ) && (state.clave === "" || state.clave === null)) {
      errors.clave=true;
      message.warning("Todos los campos son requeridos");
      //return false;
    } else if ((state.correo === "" || state.correo === null ) && (state.clave !== "" || state.clave !== null)) {
      errors.correo=true;
      message.warning("Todos los campos son requeridos");
      //return false;
    } else if (!validateEmail(state.correo)) {
      errors.correo=true;
      message.warning("El correo electrónico es incorrecto");
      //return false;
    } else if (!validateContrasena(state.clave)) {
      //setErrorPassword(errorPassword);
      errors.clave=true;
      //isValid = false;
      message.warning("Contraseña incorrecta");
    }
    else {
      message.error("No tiene permitido el acceso");
    }
  //}
  setFormError(errors);
  };


  const RecuperarClave = () =>{
    history.push("/recovery");
  }
 
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  return (
    
      <div className="containerp">
      <div className="logo">
      <img src={logo} alt=""/>
      </div>
      <div className="form">
      <Form
      name="normal_login"
      className={style.loginForm}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
      <Form.Item 
      name="username"
      >
        <Input
          prefix={<UserOutlined />}
          type="email"
          style={ formError.correo && {borderColor: "#CC0000"}}
          placeholder="Correo electrónico"
          onChange={(e) => handlechange(e, "correo")}
        />
      </Form.Item>

      <Form.Item name="password">
        <Input.Password
          prefix={<LockOutlined />}
          type="password"
          style={ formError.clave && {borderColor: "#CC0000"}}
          placeholder="Contraseña"
          onChange={(e) => handlechange(e, "clave")}
        />
      </Form.Item>


      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Recordar contraseña</Checkbox>
        </Form.Item>
      </Form.Item>

      <Form.Item>
        <Button
        style={{width:"95%"}}
          type="primary"
          onClick={handleLogin}
          className={style.LoginButton}
        >
          Ingresar
        </Button>
      </Form.Item>

      <Form.Item>
        <Button
          style={{width:"95%"}}
          onClick={RecuperarClave}
          className={style.LoginButton}
        >
          Recuperar contraseña
        </Button>
      </Form.Item>
    </Form>
      </div>
    </div>
   
   

    

    
  );
};

export default LoginPage;

const useStyles = makeStyles((theme) => ({
 
/*   loginForm: {
    margin: "10% auto",
    maxWidth: "300px",
  },
  Forgot: {
    float: "right",
  },
  LoginButton: {
    width: "100%",
  }, */

}));
