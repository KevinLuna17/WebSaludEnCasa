import React from 'react'
import { BrowserRouter as Router , Route , Switch } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import UsuariosPage from '../Pages/Usuarios'
import ServiciosPage from '../Pages/Servicios'
import AdminUsuarios from '../Pages/AdminUsuarios'
import ReportesPage from '../Pages/ReportesPage'
import Error404 from '../Pages/Error404'
import HomePage from '../Pages/HomePage'
import LoginPage from '../Pages/LoginPage'
import SolicitudesPage from '../Pages/SolicitudesPage'
import RegisterPage from '../Pages/ReguisterPage'
import RecoveryPage from '../Pages/RecoveryPage'
import PivateRoute from './PivateRoute'
import PublicRoute from './PublicRoute'
const AppRouter = () => {
    return (
        <Router>
                <Navbar/>
            <Switch>

                {/* RUTAS COMUNES */}

                <PivateRoute exact path="/usuarios" component={UsuariosPage}/>
                <PivateRoute exact  path="/servicios" component={ServiciosPage}/>
                <PivateRoute exact  path="/AdminUsuarios" component={AdminUsuarios}/>

                {/* RUTAS PUBLICAS */}

                <PublicRoute exact  path="/login" component={LoginPage}/>
                <PublicRoute exact  path="/register" component={RegisterPage}/>

                <PublicRoute exact  path="/recovery" component={RecoveryPage}/>

                {/* RUTAS PRIVADAS */}

                <PivateRoute exact  path="/reporte" component={ReportesPage}/>
                <PivateRoute exact  path="/solicitudes" component={SolicitudesPage}/>

                

                {/* RUTAS POR DEFECTO */}

                <PivateRoute exact path="/" component={HomePage}/>
                <Route exact path="*" component={Error404}/>

            </Switch>
        </Router>
    )
}

export default AppRouter
