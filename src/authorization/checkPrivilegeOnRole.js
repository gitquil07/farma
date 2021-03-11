import {
    super_admin,
    admin,
    employee,
    customer,
    demo
} from "./defineRoles";
import allPrivileges from "./privileges";

const checkPrivilegeOfRole = (role, privilege) => {

    // console.log("role", role);
    // If role does not exist throw error
    if(!(privilege in allPrivileges)){
        throw new Error("such privilege is not existed");
    }

    // Check would current role have passed privilege
    switch(+role){
        case 1:
            return super_admin[privilege];
        case 2:
            return admin[privilege];
        case 3:
            return employee[privilege];
        case 4:
            return customer[privilege];
        case 10:
            return demo[privilege];
        default:
            throw new Error("User with such role don't exist");
    }
}

export default checkPrivilegeOfRole;
