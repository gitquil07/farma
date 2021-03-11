import allPrivileges from "./privileges";

// Setting privileges for (super_admin)
const super_admin = {...allPrivileges};

// Setting privileges for (admin)
const admin = {
    ...allPrivileges,
    "SOFT_DELETE" : false,
    "ADD_ADMIN" : false,
    "HELP_FOR_CUSTOMERS" : false,
    "HELP_FOR_EMPLOYEES" : false
};

// Setting privileges for (employee)
const employee = {
    ...allPrivileges,
    "SOFT_DELETE" : false,
    "ARCHIEVE_DATA" : false,
    "ADD_ROLES" : false,
    "ADD_NEWS" : false,
    "CHANGE_SETTINGS" : false,
    "HELP_FOR_ADMINS" : false,
    "HELP_FOR_CUSTOMERS" : false
};

// Setting privileges for (customer)
const customer = {
    ...allPrivileges,
    "ACCESS_PRIVATE_ROUTES" : false,
    // "ADD_ADMIN" : false,
    "CREATE_DATA" : false,
    "UPDATE_DATA" : false,
    "ARCHIEVE_DATA": false,
    "SOFT_DELETE" : false,
    "ADD_ROLES" : false,
    "ADD_NEWS" : false,
    "CHANGE_SETTINGS" : false,
    "HELP_FOR_EMPLOYEES" : false,
    "HELP_FOR_ADMINS" : false
};

// Setting privileges for (demo)
const demo = {
    ...allPrivileges,
    "ACCESS_PRIVATE_ROUTES" : false,
    // "ADD_ADMIN" : false,
    "CREATE_DATA" : false,
    "UPDATE_DATA" : false,
    "ARCHIEVE_DATA": false,
    "SOFT_DELETE" : false,
    "ADD_ROLES" : false,
    "ADD_NEWS" : false,
    "CHANGE_SETTINGS" : false,
    "HELP_FOR_EMPLOYEES" : false,
    "HELP_FOR_ADMINS" : false,
    "ACCESS_TO_REST" : false
}


export {
    super_admin,
    admin,
    employee,
    customer,
    demo
};