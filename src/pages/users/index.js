import React from "react";
import { Route } from 'react-router-dom';
import UsersTable from "./Users";
import AddUserForm from "./addUsers/AddUserForm";

function Users(props) {
    const {url} = props.match;
    return(
        <>
            <Route exact path={`${url}/`} {...props}><UsersTable/></Route>
            <Route path={`${url}/add`} {...props}><AddUserForm/></Route>
        </>
    )
};

export default Users;
