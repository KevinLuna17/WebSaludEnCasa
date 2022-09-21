import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { db } from "../../firebase/firebase-config";
import { Table, Button, Popconfirm, message } from "antd";
import { EnviarCorreo } from '../../Api/sendCorreo';
import firebase from 'firebase/compat/app';
require('firebase/compat/auth')
var md5 = require("md5");
const pagination = {
  pageSize: 5,
};
const SolicitudesPage = () => {
  const styles = useStyles();
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    GetUsuarios();
    setLoading(true);
  }, []);

  const confirm = async  (dato) => {

    console.log(dato);
    if(dato.tipouser ==='MEDICO'){
      firebase
      .auth()
      .createUserWithEmailAndPassword(dato.correo, dato.contrasena)
      .then(() => {
        db.collection("usuarios")
        .doc(dato.id)
        .update({
          estado: "AC",
        })
        .then(async() => {
          message.success("El usuario ha sido aceptado");
          await EnviarCorreo('SALUD EN CASA',dato.correo,'REGISTRO DE USUARIO');
          GetUsuarios();
        });
      })
      .catch(() => {
        console.log("error")
      });
    }else{
      db.collection("usuarios")
        .doc(dato.id)
        .update({
          estado: "AC",
        })
        .then(() => {
          message.success("El usuario ha sido aceptado");
          GetUsuarios();
        });
    }
    
  };

  const GetUsuarios = async () => {
    let DataSecretaria = "";
    let querySnapshot = "";
    let Docs = [];

    const usuario = JSON.parse(localStorage.getItem("User"));

    if (usuario.tipouser == "SECRETARIA") {
      querySnapshot = await db
        .collection("usuarios")
        .where("tipouser", "not-in", ["ADMINISTRADOR", "SECRETARIA"])
        .get();
    } else {
      querySnapshot = await db
        .collection("usuarios")
        .where("estado", "==", "DC")
        .get();
    }

    querySnapshot.forEach((doc) => {
      Docs.push({ ...doc.data(), id: doc.id });
    });

    if (usuario.tipouser == "SECRETARIA") {
      DataSecretaria = Docs.filter((Doc) => Doc.estado == "DC");
      Docs = DataSecretaria;
      console.log(DataSecretaria);
    }

    let JsonDatos = JSON.parse(JSON.stringify(Docs));
    let JsonDatosIndex = JsonDatos.length;
    for (let i = 0; i < JsonDatosIndex; i++) {
      JsonDatos[i].createAt = RetornarFecha(JsonDatos[i].createAt);
      JsonDatos[i].key = i;
    }

    setData(JsonDatos);
    setLoading(false);
  };

  const RetornarFecha = (fecha) => {
    const createReview = new Date(fecha.seconds * 1000);
    let Fecha =
      createReview.getDate() +
      "-" +
      ((createReview.getMonth() +  1) < 10 ? "0" : "" )  +
      (createReview.getMonth() +  1) +
      "-" +
      createReview.getFullYear() +
      " " +
      createReview.getHours() +
      ":" +
      (createReview.getMinutes() < 10 ? "0" : "") +
      createReview.getMinutes();
    return Fecha;
  };

  const eliminar = (dato) => {
    // EliminarUsuario(dato.id);
    db.collection("usuarios")
      .doc(dato.id)
      .update({
        estado: "OFF",
      })
      .then(() => {
        message.success("El usuario ha sido eliminado");
        GetUsuarios();
      })
      .catch(() => {
        message.error("No se pudo eliminar el usuario, por favor intente más tarde");
      });
  };

  const columns = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      // ...getColumnSearchProps('userid','Id'),
      fixed: "left",
      width: 150,
    },
    {
      title: "Correo",
      dataIndex: "correo",
      key: "correo",
      // ...getColumnSearchProps('username','Nombre'),
      width: 150,
    },
    {
      title: "Tipo",
      dataIndex: "tipouser",
      key: "tipouser",
      width: 150,
    },
    {
      title: "Fecha de creación",
      dataIndex: "createAt",
      key: "createAt",
      // ...getColumnSearchProps('useridentificacion','Identificacion'),
      width: 150,
    },
    {
      title: "Acciones",
      key: "acciones",
      fixed: "right",
      render: (fila) => (
        <>
          {/* <Button type="primary" onClick={()=>ControlModales(fila,'Editar')}>Editar</Button> {" "} */}
          <Popconfirm
            placement="topRight"
            title={"¿Desea aceptar este usuario?"}
            onConfirm={() => confirm(fila)}
            okText="Si"
            cancelText="No"
          >
            <Button>Aceptar</Button>
          </Popconfirm>
          <Popconfirm
            placement="topRight"
            title={"¿Desea eliminar este usuario?"}
            onConfirm={() => eliminar(fila)}
            okText="Si"
            cancelText="No"
          >
            <Button type="primary" danger>
              Eliminar
            </Button>
          </Popconfirm>
        </>
      ),
      width: 200,
    },
  ];

  return (
    <div>
      <h1
        style={{ fontWeight: "bold", marginTop: "20px", marginBottom: "20px",whiteSpace:"nowrap"  }}
      >
        Solicitudes de usuarios
      </h1>
      <Table
        className={styles.table}
        loading={loading}
        columns={columns}
        key={data.key}
        dataSource={data}
        pagination={pagination}
        scroll={{ y: 350, x: 900 }}
      />
    </div>
  );
};

export default SolicitudesPage;

const useStyles = makeStyles((theme) => ({
  table: {
    // margin: '0 auto',
    width: "82%",
    position: "fixed",
    marginLeft: "220px",
  },
  BtnIngresar: {
    margin: "10px 0px 10px 5%",
  },
}));
