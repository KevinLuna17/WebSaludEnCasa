/* eslint-disable */
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { db } from "../../firebase/firebase-config";
import firebase from "firebase/compat/app";
import { uuid } from "uuidv4";
import "firebase/compat/storage";
import "firebase/compat/firestore";
import {
  Table,
  Button,
  Modal,
  Upload,
  Input,
  Form,
  Popconfirm,
  message,
  Select,
  List,
} from "antd";
import ImgCrop from 'antd-img-crop';
import { PlusOutlined } from "@ant-design/icons";
const { Item } = Form;
const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 20,
  },
};
const pagination = {
  pageSize: 5,
};
const { Option } = Select;

const ServiciosPage = () => {
  const styles = useStyles();
  const [data, setData] = useState([]);
  const [value, setValue] = useState("");
  const [Doctor, setDoctor] = useState([]);
  const [modal, setModal] = useState(false);
  const [LabelModal, setLabelModal] = useState("");
  const [disable, setDisable] = useState(false);

  const [loading, setLoading] = useState(false);
  const AbrirModal = () => {
    setModal(!modal);
  };
  const Servicios = {
    id: "",
    address: "Alborada 8va etapa Mz.831 V.18",
    createAt: "",
    createBy: "",
    description: "",

    fileList: [],
    imagenes: [],
    previewVisible: false,
    previewImage: "",
    previewTitle: "",

    latitude: "",
    longitude: "",
    nombre: "",

    callingCode: "593",
    email: "saludencasagye@gmail.com",
    nombreMedico: "",
    phone: "0983404656",
    precioServicio: "",

    quantityVoting: "",
    rating: "",
    ratingTotal: "",
  };

  const [usuario, setUsuario] = useState(Servicios);

  useEffect(() => {
    GetServicios();
    ObtenerDoctores();
    setLoading(true);
  }, []);

  const handleCancel = () =>
    setUsuario({
      ...usuario,
      previewVisible: false,
    });

  const handlePreview = async (file) => {
    console.log(file);
    setUsuario({
      ...usuario,
      previewImage: file.thumbUrl || file.url,
      previewVisible: true,
      previewTitle: file.name,
    });
  };

  const ObtenerImagen = ({ fileList }) => {

    const Autorizado = ['jpeg','jpg','png','gif'];

    if(fileList.length>0){
      for(let i=0; i<fileList.length;i++){
        let TIPO_MAGE = fileList[i].type.split('/')[1];
        if(!Autorizado.includes(TIPO_MAGE)){
          message.warning("El archivo que intenta subir no es una imagen");
          return
        }
        if(fileList[i]?.size > 500000) {
          console.log("LA IMAGEN ES MUY PESADA")
          message.warning("La imagen es muy pesada");
          return
        }
      }
    }
    
    setUsuario({
      ...usuario,
      fileList: fileList,
    });
  };

  const ValidarEdicionUsuario = () => {
    if (
      ValidarDireccion() &&
      ValidarCodigoTelefono() &&
      ValidarTelefono() &&
      ValidarCorreo() &&
      ValidarMedico() &&
      ValidarServicio() &&
      ValidarPrecio() &&
      ValidarDescripcion() &&
      ValidarImagen()
    ) {
      return true;
    }
    return false;
  };

  const ValidarDireccion = () => {
    if (usuario.address === "" || usuario.address === null) {
      message.warning("Ingrese la dirección");
      return false;
    }
    return true;
  };
  const ValidarCodigoTelefono = () => {
    let valoresAceptados = /^[0-9]+$/;
    if (!usuario.callingCode.match(valoresAceptados)) {
      message.warning("Ingrese el código");
      return false;
    }
    return true;
  };
  const ValidarTelefono = () => {
    let valoresAceptados = /^[0-9]+$/;
    if (usuario.phone === "" || usuario.phone === null) {
      message.warning("Ingrese un número telefónico");
      return false;
    }
    if (!usuario.phone.match(valoresAceptados)) {
      message.warning("El número es incorrecto");
      return false;
    }
    if (usuario.phone.length !== 10) {
      message.warning("El número es incorrecto");
      return false;
    }
    return true;
  };
  const ValidarCorreo = () => {
    let valoresAceptados =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (usuario.email === "" || usuario.email === null) {
      message.warning("Ingrese un correo electrónico");
      return false;
    }
    if (!usuario.email.match(valoresAceptados)) {
      message.warning("El correo es incorrecto");
      return false;
    }
    return true;
  };
  const ValidarMedico = () => {
    if (usuario.nombreMedico === "" || usuario.nombreMedico === null) {
      message.warning("Ingrese el nombre del médico");
      return false;
    }
    return true;
  };
  const ValidarServicio = () => {
    if (usuario.nombre === "" || usuario.nombre === null) {
      message.warning("Ingrese el nombre del servicio");
      return false;
    }
    return true;
  };
  const ValidarPrecio = () => {
    let valoresAceptados = /^\d{1,5}(\.\d{2})*(,\d+)?$/;
    if (!usuario.precioServicio.match(valoresAceptados)) {
      message.warning("El precio es incorrecto");
      return false;
    }
    return true;
  };
  const ValidarDescripcion = () => {
    if (usuario.description === "" || usuario.description === null) {
      message.warning("Ingrese la descripción");
      return false;
    }
    return true;
  };
  const ValidarImagen = () => {
    if (usuario.fileList.length < 1) {
      message.warning("Ingrese al menos 1 imagen del servicio médico");
      return false;
    }
    return true;
  };

  /* Parte agregada de Doctores */
  const ObtenerDoctores = () =>{
    db.collection("usuarios")
        .where("tipouser", "==", "MEDICO")
        .where("estado", "==", "AC")
        .onSnapshot(manejarSnapshot);
  }

  function manejarSnapshot(snapshot) {
    const Medicos = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    //Almacenar los resultados en el estado
    setDoctor(Medicos);
  }

  /* const Doctores = () =>{
    return( Doctor.map( (x,index) => { 
      return( 
          <List
            key={index}
            label={x.nombre}
            value={x.nombre}
          />
      )} ));
  } */

  const handleSelect = (value) => {
    setUsuario({
      ...usuario,
      nombreMedico: value,
    });
  };
  
  /*     *****************       */

  const GetServicios = async () => {
    const querySnapshot = await db
      .collection("serviciosmedicos")
      .where("estado", "==", "AC")
      .get();

    const Docs = [];

    querySnapshot.forEach((doc) => {
      Docs.push({ ...doc.data(), id: doc.id });
    });

    let JsonDatos = JSON.parse(JSON.stringify(Docs));
    let JsonDatosIndex = JsonDatos.length;

    for (let i = 0; i < JsonDatosIndex; i++) {
      var nombre = [];
      let CantImg = JsonDatos[i].images.length;

      for (let j = 0; j < CantImg; j++) {
        nombre.push({
          uid: "" + i + "" + j,
          key: "" + i + "" + j,
          name: "image.png",
          status: "done",
          url: JsonDatos[i].images[j],
          thumbUrls: getBase64Image(JsonDatos[i].images[j]),
        }); //,"thumbUrl": getBase64Image(JsonDatos[i].images[j])
      }
      JsonDatos[i].createAt = RetornarFecha(JsonDatos[i].createAt);
      JsonDatos[i].key = i;
      JsonDatos[i].fileList = nombre;
    }
    console.log(JsonDatos);
    setData(JsonDatos);
    setLoading(false);
  };

  var getBase64Image = (url) => {
    let IMAGEN = [];
    const img = new Image();

    img.setAttribute("crossOrigin", "anonymous");
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      IMAGEN.push(dataURL);
    };
    return IMAGEN;
  };

  const RetornarFecha = (fecha) => {
    const createReview = new Date(fecha.seconds * 1000);
    let Fecha =
      createReview.getDate() +
      "-" +
      /* (createReview.getMonth() + 1) + */
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

  const ControlModales = (data, name) => {
    setUsuario(data);
    setLabelModal(name);
    AbrirModal();
    if (name === "Editar") {
      setDisable(true);
    } else {
      setDisable(false);
    }
  };
  const ControlOperaciones = (name) => {
    const OPCION_OPERACIONES = {
      Ingresar: () => {
        CrearUsuarios();
      },
      Editar: () => {
        EditarUsuarios();
      },
    };
    OPCION_OPERACIONES[name]();
  };
  const columns = [
    {
      title: "Fecha de creación",
      dataIndex: "createAt",
      key: "createAt",
      //fixed: "left",
      // ...getColumnSearchProps('username','Nombre'),
      width: 150,
    },
    {
      title: "Rol creador",
      dataIndex: "createBy",
      key: "createBy",
      width: 150,
    },
    {
      title: "Nombre servicio",
      dataIndex: "nombre",
      key: "nombre",
      width: 150,
    },
    {
      title: "Médico",
      dataIndex: "nombreMedico",
      key: "nombreMedico",
      // ...getColumnSearchProps('username','Nombre'),
      width: 150,
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
      // ...getColumnSearchProps('useridentificacion','Identificacion'),
      width: 150,
    },
    {
      title: "Precio",
      dataIndex: "precioServicio",
      key: "precioServicio",
      // ...getColumnSearchProps('username','Nombre'),
      width: 150,
    },
    {
      title: "Dirección",
      dataIndex: "address",
      key: "address",
      // ...getColumnSearchProps('userid','Id'),
      width: 150,
    },
    {
      title: "Código país",
      dataIndex: "callingCode",
      key: "callingCode",
      // ...getColumnSearchProps('username','Nombre'),
      width: 150,
    },
    {
      title: "Teléfono",
      dataIndex: "phone",
      key: "phone",
      // ...getColumnSearchProps('username','Nombre'),
      width: 150,
    },
    {
      title: "Correo electrónico",
      dataIndex: "email",
      key: "email",
      // ...getColumnSearchProps('username','Nombre'),
      width: 150,
    },
    {
      title: "Acciones",
      key: "acciones",
      fixed: "right",
      render: (fila) => (
        <>
          <Button type="primary" onClick={() => ControlModales(fila, "Editar")}>
            Editar
          </Button>{" "}
          <Popconfirm
            placement="topRight"
            title={"¿Desea eliminar este servicio médico?"}
            onConfirm={() => confirm(fila)}
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

  const CrearUsuarios = async () => {
    if (ValidarEdicionUsuario()) {
      console.log(usuario);

      const IMG = [];

      usuario.fileList.map((num) => {
        IMG.push(num.thumbUrl);
      });

      const base64str = IMG;

      await SubirImagenes(base64str).then((response) => {
        console.log("Arreglo...");
        console.log(response);
        const Login = JSON.parse(localStorage.getItem("User"));
        db.collection("serviciosmedicos")
          .add({
            nombreMedico: usuario.nombreMedico,
            nombre: usuario.nombre,
            address: usuario.address,
            description: usuario.description,
            precioServicio: usuario.precioServicio,
            callingCode: usuario.callingCode,
            phone: usuario.phone,
            email: usuario.email,
            images: response,
            rating: 0,
            ratingTotal: 0,
            quantityVoting: 0,
            createAt: new Date(),
            createBy: Login.createBy,
            estado: "AC",
          })
          .then(() => {
            message.success("Se creó el servicio médico correctamente");
            AbrirModal();
            GetServicios();
          })
          .catch(() => {
            message.error(
              "No se pudo crear el servicio médico, por favor intente más tarde"
            );
          });
      });
    }
  };

  const SubirImagenes = async (base64str) => {
    console.log(base64str);
    const imageBlob = [];

    console.log(uuid());

    await Promise.all(
      base64str.map(async (base64str, index) => {
        const ref = firebase.storage().ref("serviciosmedicos").child(uuid());
        await ref
          .putString(base64str.split(",")[1], "base64", {
            contentType: "image/png",
          })
          .then(async (result) => {
            //Para obtener la Url de las imagenes que se suben al Storage
            await firebase
              .storage()
              .ref(`serviciosmedicos/${result.metadata.name}`)
              .getDownloadURL()
              .then((photoUrl) => {
                imageBlob.push(photoUrl);
              });
          });
      })
    );

    return imageBlob;
  };

  const confirm = (dato) => {
    // EliminarUsuario(dato.id);
    db.collection("serviciosmedicos")
      .doc(dato.id)
      .update({
        estado: "DC",
      })
      .then(() => {
        message.success("Se eliminó el servicio médico correctamente");
        GetServicios();
      })
      .catch(() => {
        message.error("No se pudo eliminar el servicio médico, por favor intente más tarde");
      });
  };

  const EditarUsuarios = async () => {
    const IMG = [];
    usuario.fileList.map((num) => {
      if (num?.thumbUrls) {
        IMG.push(num.thumbUrls[0]);
      }
      if (num?.thumbUrl) {
        IMG.push(num.thumbUrl);
      }
    });

    const base64str = IMG;

    await SubirImagenes(base64str).then((response) => {
      console.log("Arreglo...");
      console.log(response);
      const Login = JSON.parse(localStorage.getItem("User"));
      db.collection("serviciosmedicos")
        .doc(usuario.id)
        .update({
          nombreMedico: usuario.nombreMedico,
          nombre: usuario.nombre,
          address: usuario.address,
          description: usuario.description,
          precioServicio: usuario.precioServicio,
          callingCode: usuario.callingCode,
          phone: usuario.phone,
          email: usuario.email,
          images: response,
          rating: 0,
          ratingTotal: 0,
          quantityVoting: 0,
          createAt: new Date(),
          createBy: Login.createBy,
          estado: "AC",
        })
        .then(() => {
          message.success("Se actualizó el servicio médico correctamente");
          AbrirModal();
          GetServicios();
        })
        .catch(() => {
          message.error("No se pudo actualizar el servicio médico, por favor intente más tarde");
        });
    });

    console.log(IMG);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((usuario) => ({
      ...usuario,
      [name]: value,
    }));
  };

  const uploadButton = (
    <div>
      {<PlusOutlined />}
      <div style={{ marginTop: 8 }}>Foto</div>
    </div>
  );

  return (
    <div>
      <h1
        style={{ fontWeight: "bold", marginTop: "20px", marginBottom: "20px", whiteSpace:"nowrap"  }}
      >
        Servicios médicos a domicilio
      </h1>
      <Button
        className={styles.BtnIngresar}
        type="primary"
        onClick={() => ControlModales(Servicios, "Ingresar")}
      >
        Ingresar
      </Button>
      <Table
        className={styles.table}
        loading={loading}
        columns={columns}
        key={data.key}
        dataSource={data}
        pagination={pagination}
        scroll={{ y: 350, x: 900 }}
      />

      <Modal
        visible={modal}
        title={LabelModal + " Servicio"}
        destroyOnClose={true}
        onCancel={AbrirModal}
        centered
        footer={[
          <Button onClick={AbrirModal}>Cancelar</Button>,
          <Button type="primary" onClick={() => ControlOperaciones(LabelModal)}>
            {LabelModal}
          </Button>,
        ]}
      >
        <Form {...layout}>
          <Item label="Id" hidden>
            <Input
              name="id"
              onChange={handleChange}
              value={usuario && usuario.id}
            />
          </Item>
         
          {LabelModal == "Editar" && (
            <>
              <Item label="Fecha de creación">
                <Input
                  name="createAt"
                  disabled={disable}
                  onChange={handleChange}
                  value={usuario && usuario.createAt}
                />
              </Item>
              <Item label="Creador">
                <Input
                  name="createBy"
                  disabled={disable}
                  onChange={handleChange}
                  value={usuario && usuario.createBy}
                />
              </Item>
            </>
          )}

          <Item label="Servicio médico" >
            <Input
              name="nombre"
              onChange={handleChange}
              value={usuario && usuario.nombre}
            />
          </Item>
          {/* <Item label="Médico">
            <Input
              name="nombreMedico"
              onChange={handleChange}
              value={usuario && usuario.nombreMedico}
            />
          </Item> */}

            {/* <Item label="Médico">
            <Select
            placeholder="SELECCIONE EL MEDICO"
            onChange={handleSelect}
            >
              {Doctores()}
             
            </Select>
            </Item>  */}

            <Item label="Médico" >
            <Select
            //value={usuario.nombreMedico}
            name="doctores"
            //id="seldoctores"
            placeholder="Seleccione el médico"
            onChange={(e) => {handleSelect(e)}}
            //value={value}
            //onClick={handleSelect}
            >
              {/* <Option value={-1}>SELECCIONE EL MEDICO</Option> */}
              {
                Doctor.map((item, i) => (
                <Option key={item.nombre} value={i.nombre}>{item.nombre}</Option>
                ))
              }
            </Select>
            </Item> 

          <Item label="Descripción" >
            <Input
              name="description"
              onChange={handleChange}
              value={usuario && usuario.description}
            />
          </Item>
          <Item label="Precio" >
            <Input
              name="precioServicio"
              onChange={handleChange}
              value={usuario && usuario.precioServicio}
            />
          </Item>
          <Item label="Dirección" >
            <Input
              name="address"
              disabled= {true}
              onChange={handleChange}
              value={usuario && usuario.address}
            />
          </Item>
          <Item label="Código de país" >
            <Input
              name="callingCode"
              disabled={true}
              onChange={handleChange}
              value={usuario && usuario.callingCode}
            />
          </Item>
          <Item label="Teléfono" >
            <Input
              name="phone"
              disabled={true}
              onChange={handleChange}
              value={usuario && usuario.phone}
            />
          </Item>
          <Item label="Correo" >
            <Input
              name="email"
              disabled={true}
              onChange={handleChange}
              value={usuario && usuario.email}
            />
          </Item>

          <Item label="Imágenes" >
            <ImgCrop 
              rotate
              modalTitle='Editar Imagen'
            >
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                fileList={usuario.fileList}
                onPreview={handlePreview}
                onChange={ObtenerImagen}
              >
                {usuario.fileList.length >= 3 ? null : uploadButton}
              </Upload>
            </ImgCrop>
            <Modal
              visible={usuario.previewVisible}
              title={usuario.previewTitle}
              footer={null}
              onCancel={handleCancel}
            >
              <img
                alt="example"
                style={{ width: "100%" }}
                src={usuario.previewImage}
              />
            </Modal>
          </Item>

          <span style={{ marginLeft: 25, fontSize:15, fontWeight:"bold"}}><i>Nota:</i></span>
          <p style={{textAlign: "center"}}>Solo se admite imágenes que pesen máximo 500kb.</p>

        </Form>
      </Modal>
    </div>
  );
};

export default ServiciosPage;

const useStyles = makeStyles((theme) => ({
  table: {
    width: "82%",
    position: "fixed",
    marginLeft: "220px",
  },
  BtnIngresar: {
    margin: "10px 0px 20px 0px",
    whiteSpace: "nowrap"
  },
}));
