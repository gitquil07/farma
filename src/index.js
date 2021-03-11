import React, {useState, useContext } from 'react';
import { useTable, useFilters, useGlobalFilter, useSortBy ,usePagination } from 'react-table';
import ReactToPrint from 'react-to-print';
import st from './crudTable.module.scss';
import ft from '../dataTable/dataTable.module.scss';
import {Button, Col, Form, Modal, Row, Table, Toast} from 'react-bootstrap';
import { GlobalFilter } from '../dataTable/globalFilter';
import ExportExcel from "../../components/excelXLSX";
import Loading from "../loading";
import checkPrivilegeOfRole from "../../authorization/checkPrivilegeOnRole";
import UploadModal from "../uploadModal";
import UserContext from "../../context/UserContext";
import {authApi} from "../../services/authService";

function CrudTable(props){
    const {role} = useContext(UserContext);
    const {loading, uploadExcel, lang, thisUser,TranslateExp, crudsPage} = props;
    const [exportDrop, setExportDrop] = useState(false);
    const [editingId, setEditingId] = useState('');
    const [response,setResponse] = useState('');
    const [showEditPass, setShowEditPass] = useState(false);
    const [show, setShow] = useState(false);
    const [password, setPassword] = useState({password:''});
    const columns = props.columns;
    const data = props.data;
    const [showUpload, setShowUpload] = useState(false);
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageOptions,
        gotoPage,
        pageCount,
        setPageSize,
        state,
        setGlobalFilter,
    } = useTable(
        {
        columns,
        data,
        initialState: { pageSize: 25 } 
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        usePagination
    )
    const { pageIndex, pageSize } = state;
    const {globalFilter} = state;
    const filterOptions = [
        {
            value: "active",
            label: TranslateExp(lang,"content.active") 
        },
        {
            value: "unactive",
            label: TranslateExp(lang,"content.unactive")
        },
        {
            value: "deleted",
            label: TranslateExp(lang,"content.deleted")
        }
    ];

    const handleUploadShow = () => {
        setShowUpload(true);
    }

    const handleUploadClose = () => {
        setShowUpload(false);
    }

    const openModal = (id) =>{
        setShowEditPass(true);
        setEditingId(id);
    };
    const closeModal = () =>{
        setShowEditPass(false);
    };
    const changePassword = (e) => {
        e.preventDefault();
        authApi.changePassword(password,editingId)
            .then(res => {
                // console.log("changed", res);
                setShow(true);
                setResponse({
                    message: res.data.message.ru,
                    status: res.data.status
                });
                setShowEditPass(false)
            })
    };


    return (
        <div className={st.crud__table}>
            <Row>
                <Col md={10}></Col>
                <Col md={2}>
                    <Toast style={{background:"lime"}} onClose={() => setShow(false)} show={show} delay={2000} autohide>
                        <Toast.Header>
                            <strong className="mr-auto">{TranslateExp(lang, "content.messageEdited")}</strong>
                        </Toast.Header>
                        <Toast.Body>{response.message?response.message:"Error"}</Toast.Body>
                    </Toast>
                </Col>
            </Row>
            <div className={st.header}>
                <div className='d-flex align-items-baseline'>
                    <h3>{props.title}</h3>
                    {props?.newsPage? '': <p className={st.title__p}>{props.menu? TranslateExp(lang,"sidebar.Users") : TranslateExp(lang,"sidebar.Products")} <span>{'>'}</span> {props.title}</p>}
                </div>
                <div className={st.head__btn}>  
                    {
                        props.hideImport? null : 
                        <>
                            <button  onClick={handleUploadShow} disabled={(loading)? true : false} className={`btn btn-sm ${ft.btn__white} mr-2`}>
                                <i className="fas fa-file-import mr-1" /> {TranslateExp(lang,"content.import")}
                            </button>
                            <UploadModal lang={lang} TranslateExp={TranslateExp} showUpload={showUpload} handleUploadClose={handleUploadClose} uploadExcel={uploadExcel}/>
                        </>

                    }                  

                    <div className={st.export__btn}
                         onMouseEnter={() => setExportDrop(true)}
                         onMouseLeave={() => setExportDrop(false)}>
                        <button disabled={(loading||page.length<1)? true : false} className={`btn btn-sm ${ft.btn__white}`}>
                            <i className="fas fa-file-export mr-1" /> {TranslateExp(lang,"content.export")}
                        </button>
                        <div className={`${(exportDrop && !loading && page.length>0)?'d-block':'d-none'} ${st.export__drop}`}>
                            <div>
                                <ExportExcel
                                     tableData={page}
                                     fileName={props.title}
                                     loading={loading}
                                     lang={lang}
                                     TranslateExp={TranslateExp}
                                />
                            </div>
                            <div onClick={() => setExportDrop(false)}>
                                <ReactToPrint 
                                    className='m-0 p-0'
                                    documentTitle={props.title}
                                    trigger={() => <button disabled={(loading)? true : false}><i className="fas fa-print" style={{margin: '0 9.5px 0 6px'}} /> {TranslateExp(lang,"content.print")}</button>}
                                    content={() => document.querySelector('#table')}
                                    copyStyles={true}
                                />
                            </div>
                        </div>
                    </div>
                    <button className={st.add__button} onClick={props.toggle} disabled={loading? true : false}>
                        <i className={"fas fa-plus"}></i> {TranslateExp(lang,"content.toAdd")}
                    </button>
                </div>

            </div>

            <div className={`${st.table__main} my-2 p-3 bg-white`}>
                <div className={st.table__nav}>
                    <div className={st.status}>
                        {
                            props.thisUser? null : 
                            <Form className={st.form__select}>
                                <Form.Label>{TranslateExp(lang,"content.status")}: </Form.Label>
                                <Form.Control as="select" custom onChange={e => props.setFilterStatus(e.target.value)} disabled={loading? true : false}>
                                    <option disabled className='bg-light'>{TranslateExp(lang,"content.status")}:</option>
                                    {
                                        filterOptions.map(option =>{
                                            return (
                                                (props.filterStatus === option.value)?
                                            <option selected value={option.value}>{option.label}</option>
                                                :
                                                <option value={option.value}> {option.label}</option>
                                            )
                                                
                                        }
                                            
                                            
                                        )
                                    }
                                </Form.Control>
                            </Form>
                        }
                        <Form className={st.form__select}>
                            <Form.Label>{TranslateExp(lang,"content.show")}: </Form.Label>
                            <Form.Control as="select" custom disabled={loading? true : false} value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
                                <option disabled className='bg-light'>{TranslateExp(lang,"content.limit")}:</option>
                                {[25, 50, 100].map(pageSize => (
                                    <option key={pageSize} value={pageSize}>
                                        {pageSize}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form>
                    </div>

                    <div className={st.table__search}>
                    {/* Seacrh : <input type="text" value={words} onChange={e => setWords(e.target.value)}/> */}
                        <GlobalFilter loading={loading}  filter={globalFilter} setFilter={setGlobalFilter} lang={lang} TranslateExp={TranslateExp}/>
                        {/* <input type='search' placeholder='...' disabled={loading? true : false} value={words} onChange={e => setWords(e.target.value)}/> */}
                        {/* <Button variant='primary' className={st.table__search__btn} disabled={loading? true : false} ><i className="fas fa-search"></i></Button> */}
                    </div>
                </div>
                {
                    (loading) 
                    ? <Loading />
                    :
                    <Table id='table' responsive bordered className={st.table} {...getTableProps()}>
                        <thead>
                            {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {/* <th className='text-left'>№</th> */}
                                {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>
                                    <div className='d-flex align-items-center justify-content-center'>
                                        <span className={`mr-2 ${st.column__header}`}>{column.render('Header')}</span>
                                        <span className={`my-auto ${st.removeOnPrint}`} {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {   (!column.notSort)?
                                                        column.isSorted ? 
                                                            column.isSortedDesc?
                                                            <i className='fa fa-chevron-down'/> 
                                                            :<i className='fa fa-chevron-up'/>
                                                        :<i className='fa fa-bars'/>
                                                    : ""
                                                }
                                        </span>
                                    </div>
                                </th>
                                ))}
                                {

                                    <>
                                        {
                                            !props.all &&
                                            <>
                                               {!thisUser &&
                                                   <th className={`${st.crud__th} ${st.removeOnPrint}`}>{TranslateExp(lang,"content.status")}</th>
                                               }
                                                <th className={`${st.crud__th} ${st.removeOnPrint}`}>{TranslateExp(lang,"content.actions")}</th>
                                            </>
                                        }
                                    </>
                                }
                            </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map((row, orderNumber) => {
                            prepareRow(row)
                                return (
                                <tr {...row.getRowProps()}>
                                    {/* <td>{ pageIndex*pageSize + orderNumber + 1 }</td> */}
                                    {row.cells.map(cell => {
                                        // {console.log("cell",cell)}
                                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    })}
                                    {
                                        !props.all &&
                                        <>
                                            {
                                                !thisUser &&
                                                <td className={st.removeOnPrint}><Button className={`btn btn-sm btn-${row.original.is_active? "success" : "danger"} ${st.status__btn}`}
                                                                                         onClick={() => props.showModalStatus(row.original._id)}>{row.original.is_active? TranslateExp(lang, "content.activeOne") : TranslateExp(lang, "content.unactiveOne")}</Button>
                                                </td>
                                            }

                                            <td className={`${st._cages} ${st.removeOnPrint}`}>
                                                <Button className={"btn btn-sm btn-warning"} onClick={() => props.edit(row.original._id)}><i className="fa fa-edit"></i></Button>
                                                {
                                                   
                                                    !thisUser &&
                                                    <>

                                                        {
                                                            !checkPrivilegeOfRole(role, "ARCHIEVE_DATA")? null :
                                                            row.original.is_deleted
                                                                ?<Button className={"btn btn-sm mx-2 btn-info"} onClick={()=>props.showModalDel(row.original._id)}><i className="fas fa-redo"></i></Button>
                                                                :<Button className={"btn btn-sm mx-2 btn-warning"} onClick={()=>props.showModalDel(row.original._id)}><i className="fa fa-archive"></i></Button>
                                                        }
                                                    </>
                                                }
                                                {
                                                    !checkPrivilegeOfRole(role, "SOFT_DELETE")? "" :
                                                        <>
                                                            <Button className={`btn btn-sm btn-danger mr-1 ${crudsPage? '': 'ml-1'}`} onClick={() => props.showModalSoftDelete(row.original._id)}><i className="fa fa-remove"></i></Button>
                                                        </>
                                                }
                                                {
                                                        thisUser&&
                                                        <Button  className={`btn btn-sm btn-secondary ${role != 1? 'ml-1' : ''}`} onClick={()=>openModal(row.original._id)}>
                                                            <i className="fas fa-retweet"></i>
                                                        </Button>
                                                }
                                            </td>
                                        </>


                                    }
                                </tr>
                            )
                            })}
                        </tbody>
                    </Table>
                }

                <div className={`${st.footer_pagination} ${(loading)?'d-none':''} `}>
                    <div>
                        {TranslateExp(lang,"pagin.page")} {pageIndex + 1} {TranslateExp(lang,"pagin.of")} {pageOptions.length}
                    </div>
                    <div>
                        <button onClick={() => gotoPage(0)} className={`${st.pagin__start} ${(!canPreviousPage)?st.disabled:""}`}>
                            <i className="fas fa-angle-double-left"></i>
                        </button>
                        <button onClick={() =>  gotoPage(pageIndex-1)} className={`${st.pagin__prev} ${(!canPreviousPage)?st.disabled:""}`}>
                            {TranslateExp(lang,"pagin.prev")}
                        </button>
                        <button onClick={() =>  gotoPage(pageIndex+1)} className={`${st.pagin__next} ${(!canNextPage)?st.disabled:""}`}>
                            {TranslateExp(lang,"pagin.next")}
                        </button>
                        <button onClick={() => gotoPage(pageCount - 1)} className={`${st.pagin__end} ${(!canNextPage)?st.disabled:""}`}>
                            <i className="fas fa-angle-double-right"></i>
                        </button>
                    </div>
                </div>
            </div>
            <Modal show={showEditPass} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{TranslateExp(lang, "content.changingPass")}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={e => changePassword(e)}>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>{TranslateExp(lang, "auth.password")}</Form.Label>
                            <Form.Control onChange={e => {
                                setPassword({password: e.target.value})
                            }}
                                          name={"password"} type='password' placeholder='**********' required/>
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                        <div>
                            <Button variant="secondary" className="btn mr-2" onClick={closeModal}>
                                {TranslateExp(lang, "content.cancel")}
                            </Button>
                            <Button type={"submit"} className={"btn"} color={"info"}>{TranslateExp(lang, "content.change")}</Button>
                        </div>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );

}

export default CrudTable;
