import React from "react";
import {Link} from "react-router-dom";

function UsersTable() {
    return(
        <>
            <p>Lorem ipsum dolor sit amet.</p>
            <Link to={"/user/add/"}>add</Link>
        </>
    )
}
export default UsersTable;