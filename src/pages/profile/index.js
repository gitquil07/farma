import React, {useContext} from 'react'
import PrivateRoute from "../../components/privateRoute";
import Changer from "./changePassword/Changer";
import Settings from "./settings/index";
import EditSettings from "./settings/editSettings/EditSettings";
import checkPrivilegeOfRole from "../../authorization/checkPrivilegeOnRole";
import UserContext from "../../context/UserContext";
import {Route, useHistory, Switch} from "react-router-dom";

function Profile(props) {
    const {url} = props.match;
    const {role} = useContext(UserContext);
    const history = useHistory();
    console.log("props", props);
    const {lang, TranslateExp} = props;
    return(
        <>
            <Route path={`${url}/changePassword`}>
                <Changer {...props}/>
            </Route>
            <Route path={`${url}/settings`} render={
                props => {
                    console.log(!checkPrivilegeOfRole(role, "CHANGE_SETTINGS"));
                    return  !checkPrivilegeOfRole(role, "CHANGE_SETTINGS")? history.goBack() : <Settings {...props} lang={lang} TranslateExp={TranslateExp}/>
                }
            } />
        
            {/*<PrivateRoute path={`${url}/settings/update`}><EditSettings /></PrivateRoute>*/}
        </>
    )
}
export default Profile
