import React from 'react'
import { Route , Redirect, useLocation } from 'react-router-dom';
import useAuth from '../Auth/useAuth';


const PivateRoute = ({ component : Component, ...rest }) => {
    const auth =  useAuth();
    const location = useLocation();
    return (
        <Route {...rest}>
            
            {
                auth.isLogged() ?
                <Component/>
                :
                <Redirect to={{pathname:"/login" , state:{from:location}}}/>
            }
            
        </Route>
    )
}

export default PivateRoute
