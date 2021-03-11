import React, { useEffect, useState, useContext } from 'react';
import st from './sidebarHover.module.scss';
import navLogo from '../pharm.png';
import {Link} from 'react-router-dom'
import checkPrivilegeOfRole from "../../../authorization/checkPrivilegeOnRole";
import {homeApi} from '../../../services/homeService';
import {settingsApi} from "../../../services/settingService";
import UserContext from "../../../context/UserContext";
import { getAllByDisplayValue } from '@testing-library/react';

function SidebarHover(props){
    const {role, lang, TranslateExp} = props,
          [totals, setTotals] = useState(null);
          const {fileUploadedFlag} = useContext(UserContext);
          console.log("fileUploadedFlag". fileUploadedFlag);

    const [filesURL, setFilesURL] = useState({
        referentPrice : {
            url : "",
            title : "also.refPr",
            type : undefined,
            name: "referentPrices",
        },
        registeredGLS : {
            url : "",
            title : "also.regFMP",
            type : undefined,
            name: "registeredGLS"
        },
        valueAddedTax : {
            url : "",
            title : "also.valueAddedTax",
            type: undefined,
            name: "valueAddedTax"
        }
    });

    const files = Object.keys(filesURL);

    async function getAllList(){
        const res = await homeApi.getAllList();
        return res.data.data;
    };

    
    useEffect(() => {
        downloadFiles(0);
      }, [fileUploadedFlag]);


    const openTab = (e) => {
        console.log("type", e.currentTarget.dataset.type);
        if(e.currentTarget.dataset.type === "pdf"){
            window.open(e.currentTarget.href);
            e.preventDefault();
        }
    }

    const downloadFiles = (type) => {
        if(type+1 <= 3){
            settingsApi.download(type+1)
                       .then(res => {
                            console.log(res.data);
                            const urlObj = URL.createObjectURL(res.data);
                            setFilesURL(filesURL => {
                                return  {
                                     ...filesURL, [files[type]] : {...filesURL[files[type]], url : urlObj, type: res.data.type.slice(res.data.type.indexOf("/")+1)}
                                 }
                             });
                       })
                       .then(() => {
                            type++;
                            downloadFiles(type);
                       })
        }else return;
    }

    useEffect(() => {
        getAllList().then(res=>{
            setTotals(res);
        });
    },[]);


    return(
        <div className={st.sideBar}>
            <div className={st.sideBar__head}>
                <div className={st.sideBar__logo}>
                    <img src={navLogo} alt=''/>
                </div>
            </div>
            <div className={st.sideBar__body}>
                <div>
                    <div className={st.nav__item}>
                        <Link to = '/' className='text-center text-white'>
                            <div className={st.nav__icon}>
                                <i className="fas fa-home"></i>
                            </div>
                            <div className={st.menu_title}>
                                <p>{TranslateExp(lang, "sidebar.Home")}</p>
                            </div>
                        </Link>
                    </div>

                    {
                        !checkPrivilegeOfRole(role, "ACCESS_PRIVATE_ROUTES")? "" : 
                        <div className={st.nav__item}>
                            <div className={st.nav__icon}>
                            <i className="fas fa-pills"></i>
                            </div>
                            <div className={st.w_100}>
                                <p>{TranslateExp(lang, "sidebar.Products")}</p>
                                <ul  className={st.accordion_item}>
                                    <Link to = '/admin/drugs' className={st.link}><li>{TranslateExp(lang, "products.med")}</li></Link>
                                    <Link to = '/admin/drc' className={st.link}><li>{TranslateExp(lang, "products.drc")}</li></Link>
                                    <Link to = '/admin/dt' className={st.link}><li>{TranslateExp(lang, "products.dt")}</li></Link>
                                    <Link to = '/admin/trademark' className={st.link}><li>{TranslateExp(lang, "products.td")}</li></Link>
                                    <Link to = '/admin/df' className={st.link}><li>{TranslateExp(lang, "products.df")}</li></Link>
                                    <Link to = '/admin/dfg' className={st.link}><li>{TranslateExp(lang, "products.dfg")}</li></Link>
                                    <Link to = '/admin/tpg' className={st.link}><li>{TranslateExp(lang, "products.tpg")}</li></Link>
                                    <Link to = '/admin/mf' className={st.link}><li>{TranslateExp(lang, "products.mf")}</li></Link>
                                    <Link to = '/admin/countries' className={st.link}><li>{TranslateExp(lang, "products.mfc")}</li></Link>
                                    <Link to = '/admin/dist' className={st.link}><li>{TranslateExp(lang, "products.dist")}</li></Link>
                                    <Link to = '/admin/sdr' className={st.link}><li>{TranslateExp(lang, "products.senders")}</li></Link>
                                    <Link to = '/admin/mnn' className={st.link}><li>{TranslateExp(lang, "products.mnn")}</li></Link>
                            </ul>
                            </div>
                        </div>
                    }

                    <div className={st.nav__item}>
                        <div className={st.nav__icon}>
                            <i className="fas fa-diagnoses"></i>
                        </div>
                        <div className={st.w_100}>
                            <p>{TranslateExp(lang, "sidebar.Analyzes")}</p>
                            <ul className={st.accordion_item}>
                                <Link  to = '/analyze/names' className={st.link}><li>{TranslateExp(lang, "analyzes.names")} ({totals?.totalDrugs})</li></Link>
                                <Link  to = '/analyze/df' className={st.link}><li>{TranslateExp(lang, "analyzes.df")} ({totals?.totalDrugForms})</li></Link>
                                <Link  to = '/analyze/companies' className={st.link}><li>{TranslateExp(lang, "analyzes.companies")} ({totals?.TotalCompanies})</li></Link>
                                <Link  to = '/analyze/dist' className={st.link}><li>{TranslateExp(lang, "analyzes.dist")} ({totals?.totalDistributors})</li></Link>
                                <Link  to = '/analyze/manufacturers' className={st.link}><li>{TranslateExp(lang, "analyzes.mf")} ({totals?.totalManufacturers})</li></Link>
                                <Link  to = '/analyze/trademarks' className={st.link}><li>{TranslateExp(lang, "analyzes.td")} ({totals?.totalTrademarks})</li></Link>
                                <Link  to = '/analyze/mnn' className={st.link}><li>{TranslateExp(lang, "analyzes.mnn")} ({totals?.totalInns})</li></Link>
                            </ul>
                        </div>
                    </div>

                    {
                        !checkPrivilegeOfRole(role, "ACCESS_TO_ALL_INFO")? null : 
                        <div className={st.nav__item}>
                            
                            <Link to='/allInfo' className='text-center text-white'>
                                <div className={st.nav__icon}>
                                    <i className="fas fa-book-open"></i>
                                </div>
                                <div className={st.menu_title}>
                                    <p>{TranslateExp(lang, "sidebar.AllInfo")}</p>
                                </div>
                            </Link>
                        </div>
                    }
                    
                    {
                        !checkPrivilegeOfRole(role, "ADD_ROLES")? null :
                        <div className={st.nav__item}>
                            <Link to = '/admin/users' className='text-center text-white'>
                                <div className={st.nav__icon}>
                                    <i className="fas fa-users"></i>
                                </div>
                                <div className={st.menu_title}>
                                    <p>{TranslateExp(lang, "sidebar.Users")}</p>
                                </div>
                            </Link>
                        </div> 
                    }

                    {
                        !checkPrivilegeOfRole(role, "ADD_ROLES")? null : 
                        <div className={st.nav__item}>
                            <Link to='/news' className='text-center text-white'>
                                <div className={st.nav__icon}>
                                    <i className="fas fa-newspaper"/>
                                </div>
                                <div className={st.menu_title}>
                                    <p>{TranslateExp(lang, "sidebar.News")}</p>
                                </div>
                            </Link>
                        </div>
                    }
                </div>

                <div className='pb-2'>
                    {
                        !checkPrivilegeOfRole(role, "ACCESS_TO_REST")? null : 
                        <div className={st.nav__item}>
                            <div className={st.nav__icon}>
                                <i className="fas fa-toolbox"></i>
                            </div>
                            <div className={st.w_100} style={{top: 'auto',bottom: '0'}}>
                                <p>{TranslateExp(lang, "sidebar.Also")}</p>
                                <div className={st.accordion_item}>
                                        {
                                            Object.keys(filesURL)?.map(fUrl => {
                                                return <a  onClick={e => openTab(e)} download={filesURL[fUrl].name} data-type={filesURL[fUrl].type} href={filesURL[fUrl].url} className={st.link}><li>{TranslateExp(lang, filesURL[fUrl].title)}</li></a>
                                            })
                                        }
                                    {/* <Link  to = '/also/refpr' className={st.link}><li>{TranslateExp(lang, "also.refPr")}</li></Link>
                                    <Link  to = '/also/regfmp' className={st.link}><li>{TranslateExp(lang, "also.regFMP")}</li></Link> */}
                                </div>
                            </div>
                        </div>
                    }

                    <div className={st.nav__item}>
                        <div className={st.nav__icon}>
                            <i className="fas fa-cog"></i>
                        </div>
                        <div className={st.w_100} style={{top: 'auto',bottom: '0'}}>
                            <p>{TranslateExp(lang, "sidebar.Help")}</p>
                            <ul className={st.accordion_item}>
                            {
                                        !checkPrivilegeOfRole(role, "HELP_FOR_ADMINS")? null : 
                                        <Link  to = '/help/forAdmin' className={`${st.link} link`}><li id='analyzeNames' className={`${st.li} links`}>{TranslateExp(lang, "help.forAdmin")}</li></Link>
                                    }
                                    {
                                        !checkPrivilegeOfRole(role, "HELP_FOR_EMPLOYEES")? null :
                                        <Link  to = '/help/forCollab' className={`${st.link} link`}><li id='analyzeCompanies' className={`${st.li} links`}>{TranslateExp(lang, "help.forCollab")}</li></Link>
                                    }
                                    {
                                        !checkPrivilegeOfRole(role, "HELP_FOR_CUSTOMERS")? null :
                                        <Link  to = '/help/forClient' className={`${st.link} link`}><li id='analyzeCompanies' className={`${st.li} links`}>{TranslateExp(lang, "help.forClient")}</li></Link>
                                    }
                            </ul>
                        </div>
                    </div>

                </div>
                
               
            </div>
        </div>
    );
}


export default SidebarHover;
