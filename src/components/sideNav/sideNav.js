import React, { useState, useContext } from "react";
import NavBar from "../navBar/navBar";
import SideBar from "../sideBar/sideBar/sideBar";
import SidebarHover from "../sideBar/sidebarHover/sidebarHover";
import st from './sideNav.module.scss';
import UserContext from "../../context/UserContext";

export default function SideNav(props){
    
    const {role} = useContext(UserContext);
    const pageContent = props.children;
    const [isOpen, setIsOpen] = useState(false);
    const windowWidth = window.innerWidth;
    return (
        <div className={st.body}>
        {
            (windowWidth > 770)? <div className='d-flex align-items-start'>
                {
                    (isOpen) ? <SideBar {...props} role={role} /> : <SidebarHover {...props} role={role}/>
                }
                <div className='w-100'>
                    <NavBar {...props} small={false} setIsOpen ={setIsOpen} isOpen={isOpen} />
                    <div className={(isOpen)?st.content_large:st.content_small}>
                        {pageContent}
                    </div>
                </div>
            </div> 
            : 
            <div >
                <div className={`${(isOpen)?st.d_block:st.d_none}`}>
                    <SideBar {...props} role={role}/>
                </div>   
                {
                    (isOpen)?<div onClick={()=>setIsOpen(false)} className={st.opacity_body}></div>:""
                }   
                <div>
                    <NavBar {...props} small={true} setIsOpen={setIsOpen} isOpen={isOpen} />
                    
                    <div className={st.small_body}>
                        {pageContent}
                    </div>
                </div>
            </div>
        }
            
        </div>
    );

}