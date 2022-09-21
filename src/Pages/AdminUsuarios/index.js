import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { db , auth } from "../../firebase/firebase-config";
import { Table, Button, Popconfirm, message , Space ,Input} from "antd";
import Highlighter from 'react-highlight-words';
import firebase from 'firebase/compat/app';
import { SearchOutlined } from "@ant-design/icons";
require('firebase/compat/auth')

var md5 = require("md5");
const pagination = {
  pageSize: 5,
};
const AdminUsuarios = () => {
  const styles = useStyles();
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    GetUsuarios();
    setLoading(true);
  }, []);

  const [state,setState] = useState({
    searchText: '',
    searchedColumn: '',
})

const handleSearch = (selectedKeys, confirm, dataIndex) => {
  confirm();
  setState(state=>({
      ...state,
      searchText:  selectedKeys[0],
      searchedColumn: dataIndex,
  }))
};

const handleReset = clearFilters => {
  clearFilters();
  setState(state=>({
      ...state,
      searchText: '',
  }))
};


  const GetUsuarios = async () => {
    let DataSecretaria = "";
    let querySnapshot = "";
    let Docs = [];

    const usuario = JSON.parse(localStorage.getItem("User"));
    const TIPO_USER = usuario.tipouser;

    
    querySnapshot = await db
        .collection("usuarios")
        .where("estado", "==" , "AC")
        .get();
    

    querySnapshot.forEach((doc) => {
      Docs.push({ ...doc.data(), id: doc.id });
    });

    let JsonDatos = JSON.parse(JSON.stringify(Docs));
    let JsonDatosIndex = JsonDatos.length;
    for (let i = 0; i < JsonDatosIndex; i++) {
      JsonDatos[i].createAt = RetornarFecha(JsonDatos[i].createAt);
      JsonDatos[i].key = i;
    }

    setData(JsonDatos);
    setLoading(false);
  };

  const getColumnSearchProps = (dataIndex,Nombre) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
            <Input
            placeholder={`Buscar ${Nombre}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ marginBottom: 8, display: 'block' }}
            />
            <Space>
            <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
            >
                Buscar
            </Button>
            <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                Resetear
            </Button>
            </Space>
        </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
        record[dataIndex]
            ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
            : '',
    render: text =>
        state.searchedColumn === dataIndex ? (
        <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[state.searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
        />
    ) : (
        text
    ),

});

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

  const Autenticacion = (correo, password) => {
    auth
      .signInWithEmailAndPassword(correo, password)
      .then((usuarioFirebase) => {
        console.log("sesión iniciada con:", usuarioFirebase.user);
        EliminarUsuario();
      });
  };

  const EliminarUsuario = () => {
    const user = firebase.auth().currentUser;
    user.delete().then(() => {
      console.log("usuario eliminado")
    }).catch((error) => {
      console.log(error)
    });
  };


  const eliminar = (dato) => {
    

    if(dato.createAt == "ADMINISTRADOR" || dato.createAt == "SECRETARIA" ){
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
    }else{
        
        db.collection("usuarios")
            .doc(dato.id)
            .update({
                estado: "OFF",
            })
            .then(() => {
                //ELIMINAR DE AUTENTICACION DE FIREBASE
                Autenticacion(dato.correo,dato.contrasena)
                GetUsuarios();
                message.success("El usuario ha sido eliminado");
            })
            .catch(() => {
                message.error("No se pudo eliminar el usuario, por favor intente más tarde");
            });

    }   
  };

  const columns = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      ...getColumnSearchProps('nombre','Nombre'),
      fixed: "left",
      width: 150,
    },
    {
      title: "Correo",
      dataIndex: "correo",
      key: "correo",
      ...getColumnSearchProps('correo','Correo'),
      width: 150,
    },
    {
      title: "Tipo",
      dataIndex: "tipouser",
      key: "tipouser",
      filters: [
        { text: 'ADMINISTRADOR', value: 'ADMINISTRADOR' },
        { text: 'SECRETARIA', value: 'SECRETARIA' },
        { text: 'USUARIO', value: 'USER' },
        { text: 'MEDICO', value: 'MEDICO' },
      ],
      onFilter: (value, record) => record.tipouser.indexOf(value) === 0,
      width: 150,
    },
    {
      title: "Fecha de creación",
      dataIndex: "createAt",
      key: "createAt",
      // sorter: (a, b) => a.createAt - b.createAt,
      width: 150,
    },
    {
      title: "Acciones",
      key: "acciones",
      fixed: "right",
      render: (fila) => (
        <>

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
        style={{ fontWeight: "bold", marginTop: "20px", marginBottom: "20px" , whiteSpace:"nowrap" }}
      >
        Administración de usuarios
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

export default AdminUsuarios;

const useStyles = makeStyles((theme) => ({
  table: {
    // margin: '0 auto',
    width: "82%",
    position: "absolute",
    marginLeft: "220px",
  },
  BtnIngresar: {
    margin: "10px 0px 10px 5%",
  },
}));
