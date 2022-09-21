import React, { useEffect, useState , useRef } from "react";
import { db } from "../../firebase/firebase-config";
import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";
import ExportExcel from "react-export-excel";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import { Button, DatePicker, message ,Modal } from "antd";
import { useReactToPrint } from 'react-to-print';
import logo from "../../../src/img/logo.png";
const { RangePicker } = DatePicker;


const ReportesPage = () => {
  const styles = useStyles();
  const [datos, setDatos] = useState([]);
  const [state, setState] = useState([]);
  const [ocultarExportar, setOcultarExportar] = useState(false);
  const ExcelFile = ExportExcel.ExcelFile;
  const ExcelSheet = ExcelFile.ExcelSheet;
  const ExcelColumn = ExcelFile.ExcelColumn;
  const componentRef = useRef();
  const [nombreExcel , setnombreExcel] = useState("");
  const [consultar, setConsultar] = useState({
    Fechas: [
      moment().subtract(4, "days").format("YYYY/MM/DD"),
      moment().format("YYYY/MM/DD"),
    ].toString(),
    Tipo: "",
  });

  useEffect(() => {
    GetReporteCitas();
  }, []);

  const Imprimir = () =>{
    Ocultar();
    handlePrint();
    Mostrar()
  }

  const handlePrint = useReactToPrint({
      content: () => componentRef.current,
  });

  const Ocultar = () =>{
      let section = document.getElementsByClassName("pvtAxisContainer pvtVertList pvtRows");
      let section2 = document.getElementsByClassName("pvtAxisContainer pvtUnused pvtHorizList");
      let section3 = document.getElementsByClassName("pvtVals");
      let section4 = document.getElementsByClassName("pvtAxisContainer pvtHorizList pvtCols");
      let Cabezera = document.getElementsByClassName("Cabezera");
      let Reporte = document.getElementsByClassName("pvtUi");
      
      section[0].style.display = 'none';
      section2[0].style.display = 'none';
      section3[0].style.display = 'none';
      section4[0].style.display = 'none';

      Reporte[0].style.marginLeft = '50px';
      Reporte[0].style.marginRight = '50px';
      Cabezera[0].style.display = 'revert';
  }
  const Mostrar = () =>{
    let section = document.getElementsByClassName("pvtAxisContainer pvtVertList pvtRows");
    let section2 = document.getElementsByClassName("pvtAxisContainer pvtUnused pvtHorizList");
    let section3 = document.getElementsByClassName("pvtVals");
    let section4 = document.getElementsByClassName("pvtAxisContainer pvtHorizList pvtCols");
    let Cabezera = document.getElementsByClassName("Cabezera");
    let Reporte = document.getElementsByClassName("pvtUi");
    section[0].style.display = 'revert';
    section2[0].style.display = 'revert';
    section3[0].style.display = 'revert';
    section4[0].style.display = 'revert';

    Reporte[0].style.margin = '0px';
    Cabezera[0].style.display = 'none';
}

  const ValidarRangoFecha = () => {
    console.log(consultar.Fechas);
    if (
      consultar.Fechas === "" ||
      consultar.Fechas === null ||
      consultar.Fechas == ["", ""]
    ) {
      message.warning("Ingrese el rango de fecha por favor");
      return false;
    }
    return true;
  };

  const GetReporteCitas = async () => {
    if (ValidarRangoFecha()) {
      let FechaArray = consultar.Fechas.split(",");
      let FechaInicial = moment(FechaArray[0]);
      let FechaFinal = moment(FechaArray[1]);
      
      console.log(Date(FechaInicial))
      console.log(FechaInicial._d)
      const querySnapshot = await db
        .collection("agendamientos")
        .where("fecha", "<=", FechaFinal._d)
        .where("fecha", ">=", FechaInicial._d)
        .get();

      const Docs = [];

      querySnapshot.forEach((doc) => {
        Docs.push({ ...doc.data(), id: doc.id });
      });

      let JsonDatos = JSON.parse(JSON.stringify(Docs));

      //EN CASO DE QUE LA FECHA SEA DE TIPO TIMESTAMP
      let JsonDatosIndex = JsonDatos.length;

      for (let i = 0; i < JsonDatosIndex; i++) {
        JsonDatos[i].fecha = RetornarFecha(JsonDatos[i].fecha);
        JsonDatos[i].createAt = RetornarFecha(JsonDatos[i].createAt);

        //INTERSECTO EL JSON Y ALTERO LOS VALORES
        JsonDatos[i].Fecha_de_creacion = JsonDatos[i].createAt;
        JsonDatos[i].Estado = JsonDatos[i].estado;
        JsonDatos[i].Telefono = JsonDatos[i].telefono;

        JsonDatos[i].Medico= JsonDatos[i].medico;
        JsonDatos[i].Nombre_del_servicio= JsonDatos[i].nombreServicio;
        JsonDatos[i].Fecha = JsonDatos[i].fecha;
        JsonDatos[i].Hora= JsonDatos[i].hora;
        JsonDatos[i].Nombre_del_paciente= JsonDatos[i].pacienteNombre;
        JsonDatos[i].Direccion_del_paciente= JsonDatos[i].direccionPaciente;
      }

      if (JsonDatos.length > 0) {
        setOcultarExportar(false);
      } else {
        setOcultarExportar(true);
      }

      setDatos(JsonDatos);
    }
  };

  const RetornarFecha = (fecha) => {

    const createReview = new Date(fecha.seconds * 1000);
    let Fecha =
      (createReview.getDate() < 10 ? "0" : "") +
      createReview.getDate() +
      "-" +
      (createReview.getMonth() + 1 < 10 ? "0" : "") +
      (createReview.getMonth() + 1) +
      "-" +
      createReview.getFullYear();
    return Fecha;
  };

  const ObtenerTiempo = (tiempo,e) => {
    let Tiempo = tiempo.toString();
    console.log("FECHA : "+Tiempo)

    if (Tiempo == ",") {
      setOcultarExportar(true);
    }

    //TRASFORMAR FECHA 
    let ArraFechas = Tiempo.split(',')
    let DATE1 = convertDateFormat(ArraFechas[0]);
    let DATE2 = convertDateFormat(ArraFechas[1]);
    Tiempo = DATE1 + ','+DATE2;

    setConsultar((consultar) => ({
      ...consultar,
      Fechas: Tiempo,
    }));
  };

  function convertDateFormat(string) {
    var info = string.split('/');
    return info[2] + '/' + info[1] + '/' + info[0];
  }

  const GenerarReporte = () => {
    console.log("Descargando excel...");
  };

  const OBTENER_FECHA_ACTUAL = () =>{
    let date = new Date();
    let output = String(date.getDate()).padStart(2, '0') + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + date.getFullYear();
    return output;
  }

  const OBTENER_NOMBRE_EXCEL = () =>{
    let date = new Date();
    let output = String(date.getDate()).padStart(2, '0') + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + date.getFullYear();
    return "REPORTE DE AGENDAMIENTOS "+output;
  }

  return (
    <div className={styles.Header}>
      <h1
        style={{ fontWeight: "bold", marginTop: "20px", marginBottom: "20px" }}
      >
        Reportes de agendamientos de citas médicas a domicilio
      </h1>
      <RangePicker
        className={styles.Fechas}
        onChange={(e, timeString) => {
          ObtenerTiempo(timeString,e);
        }}
        defaultValue={[moment().subtract(4, "days"), moment()]}
        format={"DD/MM/YYYY"}
        // format={"YYYY/MM/DD"}
      />
      <Button onClick={() => GetReporteCitas()} type="primary">
        Consultar
      </Button>

      <Button style={{marginLeft:'15px'}}  onClick={()=>Imprimir()}>
        PDF
      </Button>
      

      <ExcelFile
        element={
          <Button
            disabled={ocultarExportar}
            className={styles.Excel}
            type="default"
            onClick={() => GenerarReporte()}
          >
            EXCEL
          </Button>
        }
        filename={OBTENER_NOMBRE_EXCEL()}
      >
        <ExcelSheet data={datos} name="Datos filtrados">
          <ExcelColumn label="MEDICO" value="medico" />
         {/*  <ExcelColumn label="TIPO SERVICIO" value="tipoServicio" /> */}
          <ExcelColumn label="NOMBRE SERVICIO" value="nombreServicio" />
          <ExcelColumn label="FECHA DE CITA" value="fecha" />
          <ExcelColumn label="HORARIO DE CITA" value="hora" />
          <ExcelColumn label="NOMBRE PACIENTE" value="pacienteNombre" />
          <ExcelColumn label="DIRECCION PACIENTE" value="direccionPaciente" />
        </ExcelSheet>
      </ExcelFile>

      <div
        ref={componentRef}
      >
        <div className="Cabezera">
            
            <div style={{float:'left', marginRight:'20px' , marginTop:'25px'}}>
              <img width="150px" src={logo} alt=""/>
            </div>
            <div style={{height:'50px'}}>

            </div>
            <div>
              <p><b>NOMBRE DE LA EMPRESA : </b>Sosa y Cárdenas</p>
              <p><b>SLOGAN : </b>"Por un Envejecimiento Saludable"</p>
              <p><b>FECHA DE EMISIÓN : </b>{OBTENER_FECHA_ACTUAL()}</p>
            </div>
            
        </div>
        <PivotTableUI
          data={datos}
          rows={[
            "Medico",
            "Nombre_del_servicio",
            "Fecha",
            "Hora",
            "Nombre_del_paciente",
            "Direccion_del_paciente",
          ]}
          onChange={(s) => setState(s)}
          {...state}
          hiddenAttributes={[
            "location",
            "idPaciente",
            "Estado",
            "createAt",
            "createBy",
            "id",
            "idServicio",
            "estado",
            "telefono",
            "medico",
            "nombreServicio",
            "hora",
            "fecha",
            "pacienteNombre",
            "direccionPaciente",
          ]}
        />
      </div>



      
    </div>
  );
};

export default ReportesPage;

const useStyles = makeStyles((theme) => ({
  Fechas: {
    marginBottom: "20px",
    marginRight: "20px",
  },
  Header: {
    position: "absolute",
    marginLeft: "220px",
  },
  Excel: {
    marginLeft: "12px",
  }
}));
