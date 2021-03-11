import React, {useContext} from "react";
import {Route, Redirect, useHistory} from "react-router-dom";
import UserContext from "../../context/UserContext";
import checkPrivilegeOfRole from "../../authorization/checkPrivilegeOnRole";


const PrivateRoute = (props) => {
    const {role} = useContext(UserContext);
    const history = useHistory();
    return(
        checkPrivilegeOfRole(role, "ACCESS_PRIVATE_ROUTES")
        ?
        <Route {...props} />
        :
        history.goBack()
        // <Redirect to="/" />
    ) 
        
}

export default PrivateRoute;