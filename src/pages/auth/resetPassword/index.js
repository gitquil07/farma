import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import st from './resetPassword.module.scss'
import {authApi} from "../../../services/authService";
import {userApi} from "../../../services/userService";
export default function ResetPassword (){
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const[userList,setUserList] = useState([]);

    const changePassword = (e) =>{
        e.preventDefault();
        if (password===confirmPassword){
            //agar bazada mavjud bulmagan email yuborilsa nma buladi?
            // authApi.reset({password}).then(resp=>{
            //     console.log("resp",resp);
            // })
        } else {
            console.log("not confirmed");
        }
    };
    console.log("password",password);
    console.log("ConfirmPass",confirmPassword);
        return (
            <div className={st.reset_body}>
                <div className={st.reset_card}>
                    <div className={st.reset_cardHeader}>
                        <h3>Reset Password</h3>
                    </div>
                    <form onSubmit={e=>changePassword(e)} className={st.reset_cardBody}>
                        <div className={st.reset_formGroup}>
                            <label className={st.reset_formLabel}>Password</label>
                            <input onChange={e=>setPassword(e.target.value)} className={st.reset_formControl} type='password' placeholder='************' required/>
                        </div>
                        <div className={st.reset_formGroup}>
                            <label className={st.reset_formLabel}>Confirm password</label>
                            <input onChange={e=>setConfirmPassword(e.target.value)} className={st.reset_formControl} type='password' placeholder='************' required/>
                        </div>
                        <button type='submit' className={st.reset_formButton}>
                            Send
                        </button>
                    </form>
                    <p className={st.reset_forgotPassword}>
                        <Link className={st.reset_forgotPasswordLink} to='/login'>Login</Link>
                     </p>
                </div>
            </div>
        )
}
