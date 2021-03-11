import React from 'react'
import { Route } from 'react-router-dom';
import AdminTable from "./adminTable/adminTable";
import AddForm from './addForm/addForm'


function Admin(props){

    const {url} = props.match;
    
    return (
        <div>
            <Route exact path={`${url}/`} >
                <AdminTable 
                    {...props} 
                />
            </Route>
            <Route path={`${url}/add`} > 
                <AddForm 
                    {...props}
                />
            </Route>

        </div>
        
    );
}
export default Admin;