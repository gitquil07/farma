import React, { useContext } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import SignUp from './signUp';
import Login from './login';
import ResetPassword from './resetPassword';
import UserContext from "../../context/UserContext";

function AUTH (props) {

    const {mac} = useContext(UserContext);
    const history = useHistory();
    console.log("check mac", mac);

    return(
        <>
            <Switch>
                <Route path = '/signUP'>
                    {
                        mac == undefined? <Redirect to="/login" /> : <SignUp {...props}/> 
                    }
                </Route>
                <Route path = '/login'><Login {...props}/></Route>
                <Route path='/reset'><ResetPassword {...props}/></Route>
                <Route render={() => <Redirect to="/login" />}></Route>
            </Switch>
        </>
    )
}

export default AUTH;
