import React, { useEffect, useState, useContext } from 'react';
import st from './sideBar.module.scss';
import navLogo from '../pharm.png';
import { Link } from 'react-router-dom';
import {Col, Modal, Row, Toast} from 'react-bootstrap';
import checkPrivilegeOfRole from "../../../authorization/checkPrivilegeOnRole";
import {homeApi} from '../../../services/homeService'
import {settingsApi} from "../../../services/settingService";
import UserContext from "../../../context/UserContext";


function SideBar(props) {

    const {role, lang, TranslateExp} = props,
          icon = <i className='fas fa-chevron-right'/>;
          const [isOpenMed, setIsOpenMed] = useState(false);
          const [isOpenProfile, setIsOpenProfile] = useState(false);
          const [isOpenAnalyze, setIsOpenAnalyze] = useState(false);
          const [isOpenAlso, setIsOpenAlso] = useState(false);
          const [isOpenHelp, setIsOpenHelp] = useState(false);
          const [totals, setTotals] = useState(null);
          const {fileUploadedFlag} = useContext(UserContext);

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
 

          useEffect(() => {
            downloadFiles(0);
          }, [fileUploadedFlag]);


    async function getAllList(){
        const res = await homeApi.getAllList();
        return res.data.data;
    };


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
                            console.log("download file", res);
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

    useEffect(()=> {

        const style = 'opacity:1; transform: scale(1.05);'
        const url = window.location.pathname;
        
        getAllList().then(res=>{
            setTotals(res)
        })
        switch (url.split('/')[1]) {
            case 'admin':
                setIsOpenMed(true);
                switch (url.split('/')[2]) {
                    case 'drugs': document.querySelector('#adminDrugs').setAttribute('style',style); break;
                    case 'drc': document.querySelector('#adminDrc').setAttribute('style',style); break;
                    case 'dt': document.querySelector('#adminDt').setAttribute('style',style); break;
                    case 'trademark': document.querySelector('#adminTrademark').setAttribute('style',style); break;
                    case 'df': document.querySelector('#adminDf').setAttribute('style',style); break;
                    case 'dfg': document.querySelector('#adminDfg').setAttribute('style',style); break;
                    case 'tpg': document.querySelector('#adminTpg').setAttribute('style',style); break;
                    case 'mf': document.querySelector('#adminMf').setAttribute('style',style); break;
                    case 'countries': document.querySelector('#adminCountries').setAttribute('style',style); break;
                    case 'dist': document.querySelector('#adminDist').setAttribute('style',style); break;
                    case 'sdr': document.querySelector('#adminSdr').setAttribute('style',style); break;
                    default: break;
                }
                break;
            case 'analyze':
                setIsOpenAnalyze(true);
                switch(url.split('/')[2]){
                    case 'main': document.querySelector('#analyzeMain').setAttribute('style',style); break;
                    case 'names': document.querySelector('#analyzeNames').setAttribute('style',style); break;
                    case 'trademarks': document.querySelector('#analyzeTrademarks').setAttribute('style',style); break;
                    default: break;
                }
                    break
            default: break;
        }
        const sidebar = document.querySelector(".side");
        const links = document.querySelectorAll(".links");

        sidebar.addEventListener("click", e => {
            if(e.target.classList.contains("links")){
                links.forEach(link => {
                    link.removeAttribute("style");
                });
                e.target.setAttribute('style',style);
                e.target.children.display='none';
            }
        })
    },[]);
    return(
            <div className={`${st.sideBar} side`}>
                <div className={st.sideBar__head}>
                    <div className={st.sideBar__logo}>
                        <img src={navLogo} alt=''/>
                    </div>
                    <div className={st.sideBar__name}>
                        <h4>Pharm Analytics</h4>
                    </div>
                </div>
                
                <div className={st.sideBar__body}>
                    <div>
                        <h6 className={st.menu__text}>{TranslateExp(lang, "sidebar.Menu")}</h6>
                        <div className={st.nav__item}>
                            <Link to='/' className='d-flex text-white text-decoration-none link'>
                                <div className={st.sideBar__icon}>
                                    <i className="fas fa-home"></i>
                                </div>
                                <div className={st.sideBar__text}>
                                    <h4 id="home">{TranslateExp(lang, "sidebar.Home")}</h4>
                                </div>
                            </Link>
                        </div>

                    
                            {/* Show crud menu if role (super_admin, admin, employee) */}
                        {
                            !checkPrivilegeOfRole(role, "ACCESS_PRIVATE_ROUTES")? "" :
                            <div>
                                <div className={st.nav__item} onClick={() => setIsOpenMed(!isOpenMed)}>
            
                                    <div className={st.sideBar__icon}>
                                        <i className="fas fa-pills"></i>
                                    </div>
                                    <div className={st.sideBar__text}>
                                        <h4>{TranslateExp(lang, "sidebar.Products")}</h4>
                                        <i className={`fas ${st.chevron} ${(isOpenMed)? 'fa-chevron-down': 'fa-chevron-right'} `}></i>
                                    </div>
            
                                </div>
                                <div className={`${st.drop__items} ${(isOpenMed)? `${st.activeMed}` : ''} `}>
                                    <ul className={st.ul}>
                                        <Link to = '/admin/drugs' className={`${st.link} link`}><li id='adminDrugs' className={`${st.li} links`}>{icon}{TranslateExp(lang, "products.med")}</li></Link>
                                        <Link to = '/admin/drc' className={`${st.link} link`}><li id='adminDrc' className={`${st.li} links`}>{icon}{TranslateExp(lang, "products.drc")}</li></Link>
                                        <Link to = '/admin/dt' className={`${st.link} link`}><li id='adminDt' className={`${st.li} links`}>{icon}{TranslateExp(lang, "products.dt")}</li></Link>
                                        <Link to = '/admin/trademark' className={`${st.link} link`}><li id='adminTrademark' className={`${st.li} links`}>{icon}{TranslateExp(lang, "products.td")}</li></Link>
                                        <Link to = '/admin/df' className={`${st.link} link`}><li id='adminDf' className={`${st.li} links`}>{icon}{TranslateExp(lang, "products.df")}</li></Link>
                                        <Link to = '/admin/dfg' className={`${st.link} link`}><li id='adminDfg' className={`${st.li} links`}>{icon}{TranslateExp(lang, "products.dfg")}</li></Link>
                                        <Link to = '/admin/tpg' className={`${st.link} link`}><li id='adminTpg' className={`${st.li} links`}>{icon}{TranslateExp(lang, "products.tpg")}</li></Link>
                                        <Link to = '/admin/mf' className={`${st.link} link`}><li id='adminMf' className={`${st.li} links`}>{icon}{TranslateExp(lang, "products.mf")}</li></Link>
                                        <Link to = '/admin/countries' className={`${st.link} link`}><li id='adminCountries' className={`${st.li} links`}>{icon}{TranslateExp(lang, "products.mfc")}</li></Link>
                                        <Link to = '/admin/dist' className={`${st.link} link`}><li id='adminDist' className={`${st.li} links`}>{icon}{TranslateExp(lang, "products.dist")}</li></Link>
                                        <Link to = '/admin/sdr' className={`${st.link} link`}><li id='adminSdr' className={`${st.li} links`}>{icon}{TranslateExp(lang, "products.senders")}</li></Link>
                                        <Link to = '/admin/mnn' className={`${st.link} link`}><li id='adminSdr' className={`${st.li} links`}>{icon}{TranslateExp(lang, "products.mnn")}</li></Link>
                                    </ul>
                                </div> 
                            </div>
                        }
                        

                        <div>
                            <div className={st.nav__item} onClick={() => setIsOpenAnalyze(!isOpenAnalyze)}>
                                
                                    <div className={st.sideBar__icon}>
                                        <i className="fas fa-diagnoses"></i>
                                    </div>
                                    <div className={st.sideBar__text}>
                                        <h4>{TranslateExp(lang, "sidebar.Analyzes")}</h4>
                                        <i className={`fas ${st.chevron} ${(isOpenAnalyze)? 'fa-chevron-down': 'fa-chevron-right'} `}></i>
                                    </div>
                                
                            </div>

                            <div className={`${st.drop__items} ${(isOpenAnalyze)? `${st.activeAnalyze}` : ''} `}>
                                <ul className={st.ul}>
                                    <Link  to = '/analyze/names' className={`${st.link} link`}><li id='analyzeNames' className={`${st.li} links`}>{icon}{TranslateExp(lang, "analyzes.names")} ({totals?.totalDrugs})</li></Link>
                                    <Link  to = '/analyze/df' className={`${st.link} link`}><li id='analyzeCompanies' className={`${st.li} links`}>{icon}{TranslateExp(lang, "analyzes.df")} ({totals?.totalDrugForms})</li></Link>
                                    <Link  to = '/analyze/companies' className={`${st.link} link`}><li id='analyzeCompanies' className={`${st.li} links`}>{icon}{TranslateExp(lang, "analyzes.companies")} ({totals?.TotalCompanies})</li></Link>
                                    <Link  to = '/analyze/dist' className={`${st.link} link`}><li id='analyzeCompanies' className={`${st.li} links`}>{icon}{TranslateExp(lang, "analyzes.dist")} ({totals?.totalDistributors})</li></Link>
                                    <Link  to = '/analyze/manufacturers' className={`${st.link} link`}><li id='analyzeCompanies' className={`${st.li} links`}>{icon}{TranslateExp(lang, "analyzes.mf")} ({totals?.totalManufacturers})</li></Link>
                                    <Link  to = '/analyze/trademarks' className={`${st.link} link`}><li id='analyzeCompanies' className={`${st.li} links`}>{icon}{TranslateExp(lang, "analyzes.td")} ({totals?.totalTrademarks})</li></Link>
                                    <Link  to = '/analyze/mnn' className={`${st.link} link`}><li id='analyzeCompanies' className={`${st.li} links`}>{icon}{TranslateExp(lang, "analyzes.mnn")} ({totals?.totalInns})</li></Link>
                                </ul>
                            </div>
                                
                        </div>


                        {
                            !checkPrivilegeOfRole(role, "ACCESS_TO_ALL_INFO")? null : 
                            <div className={st.nav__item}>
                                <Link to='/allInfo' className='d-flex text-white text-decoration-none link'>
                                    <div className={st.sideBar__icon}>
                                        <i className="fas fa-book-open"></i>
                                    </div>
                                    <div className={st.sideBar__text}>
                                        <h4>{TranslateExp(lang, "sidebar.AllInfo")}</h4>
                                    </div>
                                </Link>
                            </div>
                        }

                        {
                            !checkPrivilegeOfRole(role, "ADD_ROLES")? null : 
                            <div className={st.nav__item}>
                                <Link to='/admin/users' className='d-flex text-white text-decoration-none link'>
                                    <div className={st.sideBar__icon}>
                                        <i className="fas fa-users"></i>
                                    </div>
                                    <div className={st.sideBar__text}>
                                        <h4>{TranslateExp(lang, "sidebar.Users")}</h4>
                                    </div>
                                </Link>
                            </div>
                        }
                        
                        {
                            !checkPrivilegeOfRole(role, "ADD_ROLES")? null : 
                            <div className={st.nav__item}>
                                <Link to='/news' className='d-flex text-white text-decoration-none link'>
                                    <div className={st.sideBar__icon}>
                                        <i className="fas fa-newspaper"></i>
                                    </div>
                                    <div className={st.sideBar__text}>
                                        <h4>{TranslateExp(lang, "sidebar.News")}</h4>
                                    </div>
                                </Link>
                            </div>
                        }
                    </div>

                    <div>
                        {
                            !checkPrivilegeOfRole(role, "ACCESS_TO_REST")? null :  
                            <div>
                                <div className={st.nav__item} onClick={() => setIsOpenAlso(!isOpenAlso)}>
                                    
                                        <div className={st.sideBar__icon}>
                                            <i className="fas fa-toolbox"></i>
                                        </div>
                                        <div className={st.sideBar__text}>
                                            <h4>{TranslateExp(lang, "sidebar.Also")}</h4>
                                            <i className={`fas ${st.chevron} ${(isOpenAlso)? 'fa-chevron-down': 'fa-chevron-right'} `}></i>
                                        </div>
                                    
                                </div>
                                

                                <div className={`${st.drop__items} ${(isOpenAlso)? `${st.activeAlso}` : ''} `}>
                                    <ul className={st.ul}>
                                        {
                                            Object.keys(filesURL)?.map(fUrl => {
                                                return <a onClick={e => openTab(e)} download={filesURL[fUrl].name} data-type={filesURL[fUrl].type} href = {filesURL[fUrl].url} className={`${st.link} link`}><li id='analyzeNames' className={`${st.li} links`}>{icon}{TranslateExp(lang, filesURL[fUrl].title)}</li></a>
                                            })
                                        }
                                        {/* <a  href = {registeredGLS} download="registered.pdf" className={`${st.link} link`}><li id='analyzeCompanies' className={`${st.li} links`}>{icon}{TranslateExp(lang, "also.regFMP")}</li></a>
                                        <a  href = {valueAddedTax} download="valueEdded" className={`${st.link} link`}><li id='analyzeNames' className={`${st.li} links`}>{icon}{TranslateExp(lang, "also.valueAddedTax")}</li></a> */}
                                    </ul>
                                </div>
                                    
                            </div>
                        }

                        <div>
                            <div className={st.nav__item} onClick={() => setIsOpenHelp(!isOpenHelp)}>
                                
                                    <div className={st.sideBar__icon}>
                                        <i className="fas fa-cog"></i>
                                    </div>
                                    <div className={st.sideBar__text}>
                                        <h4>{TranslateExp(lang, "sidebar.Help")}</h4>
                                        <i className={`fas ${st.chevron} ${(isOpenHelp)? 'fa-chevron-down': 'fa-chevron-right'} `}></i>
                                    </div>
                                
                            </div>

                            <div className={`${st.drop__items} ${(isOpenHelp)? `${st.activeHelp}` : ''} `}>
                                <ul className={st.ul}>
                                    {
                                        !checkPrivilegeOfRole(role, "HELP_FOR_ADMINS")? null : 
                                        <Link  to = '/help/forAdmin' className={`${st.link} link`}><li id='analyzeNames' className={`${st.li} links`}>{icon}{TranslateExp(lang, "help.forAdmin")}</li></Link>
                                    }
                                    {
                                        !checkPrivilegeOfRole(role, "HELP_FOR_EMPLOYEES")? null :
                                        <Link  to = '/help/forCollab' className={`${st.link} link`}><li id='analyzeCompanies' className={`${st.li} links`}>{icon}{TranslateExp(lang, "help.forCollab")}</li></Link>
                                    }
                                    {
                                        !checkPrivilegeOfRole(role, "HELP_FOR_CUSTOMERS")? null :
                                        <Link  to = '/help/forClient' className={`${st.link} link`}><li id='analyzeCompanies' className={`${st.li} links`}>{icon}{TranslateExp(lang, "help.forClient")}</li></Link>
                                    }
                                </ul>
                            </div>
                                
                        </div>

                    </div>

                </div>
            </div>
    );
}




export default SideBar;
