export default function genPass(len) {

    let password = "";
    let symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < len; i++)
    {
        password += symbols.charAt(Math.floor(Math.random() * symbols.length));     
    }

    let passInput = document.querySelectorAll('.password_reg');
    passInput[0].value = password;
    passInput[1].value = password;
        
}
