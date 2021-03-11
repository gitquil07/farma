import React, {useEffect, useState, useContext} from 'react';
import st from './navBar.module.scss';
import './navbar.scss';
import user from './user.png'
import {Dropdown} from 'react-bootstrap'
import {authApi} from "../../services/authService";
import UserContext from "../../context/UserContext";
import LangContext from "../../context/LangContext";
import {useHistory,Redirect} from "react-router-dom";
import {NewsApi} from "../../services/newsService";
import { Link } from "react-router-dom";
import checkPrirvilegeOfRole from "../../authorization/checkPrivilegeOnRole";

function NavBar(props){
    const {TranslateExp} = props;
    const [data,setData] = useState({});
    const [netError, setNetError] = useState(false);

    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    const TWO_DAYS = 2 * 24 * 60 * 60 * 1000;

    const {role, setStateValue} = useContext(UserContext);
    const {lang, setLang} = useContext(LangContext);
    const history = useHistory();

    const [leftTime, setLeftTime] = useState("");
    const [newsNotification, setNewsNotification] = useState([]);

    useEffect(()=>{
        gets(); 
        let timerId = setInterval(() => {
            getLastNews();
        }, 100000);

        return () => {
            clearInterval(timerId);
        }
    },[]);

    // useEffect(() => {
    //     if("um_expired_at" in data){
    //         const expirationDate = data.um_expired_at,
    //         expDateInMilliseconds = new Date(expirationDate).getTime(),
    //         remainTimeInMilliseconds = expDateInMilliseconds - Date.now();

    //         if(remainTimeInMilliseconds <= 2592000000){
    //             setLeftTime(remainTimeInMilliseconds);
    //         }

    //     }
    // }, [data]);


    let gets = () =>{
        authApi.userMe().then(resp=>{
            const {data} = resp.data;

            if(role === 4){
                const expirationDate = data.um_expired_at,
                expDateInMilliseconds = new Date(expirationDate).getTime(),
                remainTimeInMilliseconds = expDateInMilliseconds - Date.now();
    
                if(remainTimeInMilliseconds <= 0){
                    sessionStorage.removeItem("token");
                    setStateValue({
                        token: null,
                        role: undefined
                    });
                }
    
                if(remainTimeInMilliseconds <= THIRTY_DAYS && remainTimeInMilliseconds > 0){
    
                    let timerId = setInterval(() => {
                        let remain = expDateInMilliseconds - Date.now();
    
                        if(remain <= 0){
                            sessionStorage.removeItem("token");
                            setStateValue({
                                token: null,
                                role: undefined
                            });
                            clearInterval(timerId);
                        }
    
                        const parsedDate = parseDate(remain);
                        setLeftTime(parsedDate);
                    }, 1000);
    
                }
            }

            setData(resp.data.data)
        })
    };

    const getLastNews = () => {
        NewsApi.getList({
            limit:10,
            page:1
        }).then(resp => {
            const {data} = resp.data;
            const filtered = data.filter(d => new Date(d.createdAt).getTime() > (Date.now() - TWO_DAYS));

            const lastThree = (filtered.length >= 3)? filtered.slice(0, 2) : filtered;

            setNewsNotification(lastThree);
        });
    }

    function parseDate(milliseconds){
        const dayMilliseconds = 24*60*60*1000,
              hourMilliseconds = 60*60*1000,
              minuteMilliseconds = 60*1000;
    
        const amountOfDays = Math.floor(milliseconds / dayMilliseconds),
              amountOfHours = Math.floor((milliseconds % dayMilliseconds) / hourMilliseconds),  
              amountOfMinutes = Math.floor(((milliseconds % dayMilliseconds) % hourMilliseconds) / minuteMilliseconds),       
              amountOfSeconds = Math.floor((((milliseconds % dayMilliseconds) % hourMilliseconds) % minuteMilliseconds) / 1000);
    
              return [amountOfDays, amountOfHours, amountOfMinutes, amountOfSeconds];
    }



    const logout = (e) =>{
        e.preventDefault();
        sessionStorage.removeItem("token");
        setStateValue({
            token: null,
            role: undefined,
            // mac: undefined
        });
        // history.push('/login');
        <Redirect to="/login"/>
    }

    const handleLangChange = (lang) => {
        setLang({
            lang
        });
    }

    return(
    <nav className={`${st.navbar} navbar py-3 
        ${(props.small)?(props.isOpen)?st.navbar_ssmall:st.navbar_slarge:
                        (props.isOpen)?st.navbar_small:st.navbar_large}`}>
        <i className={`${st.fa_bars} fa fa-bars`} 
            onClick={()=>props.setIsOpen(!props.isOpen)}>
        </i>
        {/*<button onClick={gets}>get</button>*/}
        {
            (leftTime !== "" && new Date(data?.um_expired_at).getTime() - Date.now() <= SEVEN_DAYS)? <p className={st.subscription}>{`${TranslateExp(props.lang, "content.subscription")} :  ${leftTime?.[0]}  ${TranslateExp(props.lang, "content.days")}, ${leftTime?.[1]} ${TranslateExp(props.lang, "content.hours")}, ${leftTime?.[2]} ${TranslateExp(props.lang, "content.minutes")}, ${leftTime?.[3]} ${TranslateExp(props.lang, "content.seconds")}`}</p> : null
        }
        <div className="d-flex align-items-baseline">
            <Dropdown className='w-0'>
                <Dropdown.Toggle  className={`${st.dropdown} nav-link dropdown-toggle p-0`} as='a' id="dropdown-basic">
                    <span className={"text-uppercase"}>{lang}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu >
                    <Dropdown.Item onClick={() => handleLangChange("eng")}>ENG</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleLangChange("ўзб")}>ЎЗБ</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleLangChange("рус")}>РУС</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Dropdown>
                <Dropdown.Toggle className={`${st.dropdown} nav-link dropdown-toggle p-0`} as='a' id="dropdown-basic">
                    <i className={`${st.bell} far fa-bell`}>
                        {
                            (newsNotification.length !== 0 || leftTime !== "")? <span className={st.redRound}></span> : null 
                        }
                    </i>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {
                        (leftTime === "" && newsNotification.length === 0)?  <Dropdown.Item className={st.news_container}>
                        <i className={`fas fa-exclamation-circle ${st.offset}`}></i>
                            <div className={st.news}>
                                    <h6 className={st.notification_title}>{
                                    
                                            TranslateExp(props.lang, "content.no-notifications")
                                    
                                        }
                                    </h6>
                                    {/* <p className={st.notification_desc}>
                                        {`${leftTime?.[0]} ${TranslateExp(props.lang, "content.days")}`}
                                    </p> */}
                                </div>
                        </Dropdown.Item> : null
                    }
                    {
                        (leftTime !== "" && new Date(data?.um_expired_at).getTime() - Date.now() <= THIRTY_DAYS)? <Dropdown.Item className={st.news_container}>
                            <i className={`fas fa-exclamation-circle ${st.offset}`}></i>
                            <div className={st.news}>
                                    <h6 className={st.notification_title}>{
                                    
                                            TranslateExp(props.lang, "content.subscription")
                                    
                                        }
                                    </h6>
                                    <p className={st.notification_desc}>
                                        {`${leftTime?.[0]} ${TranslateExp(props.lang, "content.days")}`}
                                    </p>
                                </div>
                        </Dropdown.Item> : null
                    }
                    {
                        newsNotification?.map(({title, description}) => (
                            <Dropdown.Item className={st.news_container}>
                                <i className={`fa fa-newspaper ${st.offset}`}></i>
                                <div className={st.news}>
                                    <h6 className={st.notification_title}>{
                                    
                                            (title.length > 30)? `${title.slice(0, 30)}...` : title
                                    
                                        }
                                    </h6>
                                    <p className={st.notification_desc}>
                                        {
                                            (description.length > 30)? `${description.slice(0, 30)}...` : description
                                        }
                                    </p>
                                </div>
                            </Dropdown.Item>
                        ))
                    }
        
                    {/* <Dropdown.Item>
                        <Link to="/messages">
                                {TranslateExp(props.lang, "navBar.messages")}
                        </Link>
                    </Dropdown.Item> */}
                </Dropdown.Menu>
            </Dropdown>
            <Dropdown>
                <Dropdown.Toggle className={`${st.dropdown} nav-link dropdown-toggle p-0`} as='a' id="dropdown-basic">
                        {data.first_name}{' '}
                        {data.last_name}
                        <img src={user} alt="User"/>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item ><Link  to = '/profile/changePassword' className={`text-decoration-none text-dark ${st.link} link`}><li id='' className={`${st.li} links`}>{TranslateExp(lang, "auth.changePass")}</li></Link></Dropdown.Item>
                    
                    {
                        !checkPrirvilegeOfRole(role, "CHANGE_SETTINGS")? null : 
                        <Dropdown.Item><Link  to = '/profile/settings' className={`text-decoration-none text-dark ${st.link} link`}><li id='' className={`${st.li} links`}>{TranslateExp(lang, "content.settings")}</li></Link></Dropdown.Item>
                    }

                    <Dropdown.Item onClick={logout}>{TranslateExp(props.lang, "navBar.logOut")}</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    </nav>
    );
}


export default NavBar;
