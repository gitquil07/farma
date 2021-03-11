import React, {useEffect, useState} from "react";
import st from "../../../../components/dataTable/dataTable.module.scss";
import ModalDeleteCrud from '../../../../components/modalDeleteCrud'
import ModalStatus from '../../../../components/modalStatus';
import ModalSoftDelete from "../../../../components/modalSoftDelete";
import ToastEx from "../../../../components/toasts";
import {useHistory} from "react-router-dom";
import Select from 'react-select';
import CrudTable from '../../../../components/crudTable'
import {DRCApi} from "../../../../services/drcService";
import {DateFormat, NumberToStr} from '../../../../utils';


function DRCTable(props){
    const {lang, TranslateExp, uploadExcel, setApi} = props;
    const title = TranslateExp(lang, "products.drc");
    const history = useHistory();
    const [priceSumValue, setPriceSumValue] = useState("usd");
    const [priceValue, setPriceValue] = useState("usd");
    const [priceCustomsValue, setPriceCustomsValue] = useState("usd");
    const optionsPrice = [{value: "usd", label:"$"},{value: "eur", label:"€"},{value: "rub", label:"₽"},{value: "uzs", label:"SO'M"}];
    const customStyles = {
        container: (provided) => ({
            ...provided,
            width: '85px',
            marginLeft: '8px',
            fontSize: '14px',
            fontWeight: 500
        })
        
    };

    const columns = [
        {
            Header: "№",
            accessor:'counter',
            notSort:true,
        },
        {
            Header: TranslateExp(lang, "table.name"),
            accessor: 'drug_name.name_uz',
        },{
            Header: TranslateExp(lang, "table.serialNum"),
            accessor: 'serial_number',
        },{
            Header: TranslateExp(lang, "table.shelfLife"),
            accessor: 'shelf_life',
        },
        {
            Header: TranslateExp(lang, "table.sender"),
            accessor: 'sender_company.name_uz',
        },
        {
            Header: ()=>{
                return(
                    <span className={st.price__th}>
                        {TranslateExp(lang, "table.customsPr")}
                        <Select 
                            options={optionsPrice}
                            disabled={true}
                            value={optionsPrice.filter(f=>f.value === priceCustomsValue)}
                            onChange={(e)=>setPriceCustomsValue(e.value)}
                            styles={customStyles}
                        />
                    </span>
                )
            },
            HeaderTitle: TranslateExp(lang, "table.name"),
            accessor: `customs_price.${priceCustomsValue}`,
            Cell:(props)=>{
                return NumberToStr(props?.value);
            }
        },
        {
            Header: ()=>{
                return(
                    <span className={st.price__th}>
                        {TranslateExp(lang, "table.price")}
                        <Select 
                            options={optionsPrice}
                            disabled={true}
                            value={optionsPrice.filter(f=>f.value===priceValue)}
                            onChange={(e)=>setPriceValue(e.value)}
                            styles={customStyles}
                        />
                    </span>
                )
            },
            HeaderTitle: TranslateExp(lang, "table.price"),
            accessor: `price.${priceValue}`,
            Cell:(props)=>{
                return NumberToStr(props?.value);
            }
        },
        {
            Header: TranslateExp(lang, "table.qty"),
            accessor: 'quantity',
        },
        {   
            Header: ()=>{
            return(
                <span className={st.price__th}>
                    {TranslateExp(lang, "table.count")}
                    <Select 
                        options={optionsPrice}
                        disabled={true}
                        value={optionsPrice.filter(f=>f.value===priceSumValue)}
                        onChange={(e)=>setPriceSumValue(e.value)}
                        styles={customStyles}
                    />
                </span>
            )
            },
            HeaderTitle: TranslateExp(lang, "table.count"),
            accessor: `sum_price.${priceSumValue}`,
            Cell:(props)=>{
                return NumberToStr(props?.value);
            }
        },
    ];
    const[loading, setLoading] = useState(true);
    const[show, setShow] = useState(false);
    const[response, setResponse] = useState('');
    const[isOpenDelete,setIsOpenDelete] = useState(false);
    const[isOpenStatus, setIsOpenStatus] = useState(false);
    const[delId,setDelId] = useState(null);
    const[respData,setRespData] = useState([])
    const[filterStatus, setFilterStatus] = useState("all");
    const[sfDeletedId, setSfDeletedId] = useState(undefined);
    const[isOpenSoftDelete, setIsOpenSoftDelete] = useState(false);
    const filter = () => {
        switch(filterStatus){
            case "all":
                DRCApi.getList().then(resp => { 
                    ChangeData(resp.data.data)
                    setLoading(false) 
                })
                break;
            case "active":
                DRCApi.getActiveList().then(resp => {
                    ChangeData(resp.data.data)
                    setLoading(false);
                    console.log(resp.data.data);
                });
                break;
            case "unactive":
                DRCApi.getUnactiveList().then(resp => {
                    ChangeData(resp.data.data)
                    setLoading(false)
                })
                break;
            case "deleted":
                DRCApi.getDeletedList().then(resp => {
                    ChangeData(resp.data.data)
                    setLoading(false)
                });
                break;
        }
    }
    function ChangeData(data){
        const DATA =[];
        data.forEach((key,id)=>{
            DATA.push({...key, counter: id+1, shelf_life: DateFormat(key.shelf_life)});
        })
        setRespData(DATA);
    }

    useEffect(() => {
        setLoading(true);
        filter();
    }, [filterStatus]);

    useEffect(() => {
        setApi(DRCApi);
    }, []);


    const DRCAdd = e => {
        history.push("/admin/drc/add");
       
    };

    const DRCEdit = (id) => {
        history.push(`/admin/drc/update/${id}`);
    };

    function del(id) {
        const is_deleted = respData.find(data => data._id == id).is_deleted;
        DRCApi.delete(id, {is_deleted: !is_deleted}).then(res=>{
            setShow(true);
            setResponse({
                message: res.data.message.ru,
                status: res.data.status
            });
            setLoading(true);
            filter();
        })
        closeDelModal();
    }
    function softDelete(id){
        DRCApi.softDelete(id).then(res => {
            setShow(true);
            setResponse({
                message: res.data.message.ru,
                status:res.data.status
            });
            setLoading(true);
            filter();
        });
        closeSoftDeleteModal();
    }

    function changeStatus(id){
        const is_active = respData.find(data => data._id === id).is_active;
        DRCApi.changeStatus(id, {is_active: !is_active}).then(resp => {
            setShow(true);
            setResponse({
                message: resp.data.message.ru,
                status:resp.data.status
            });
            filter();
        });
        closeStatusModal();
    }

    const showModalSoftDelete = (id) => {
        setSfDeletedId(id);
        setIsOpenSoftDelete(true);
    }

    const closeSoftDeleteModal = () => {
        setIsOpenSoftDelete(false);
    }
    const showModalDel=(id)=>{
        const is_deleted = respData.find(d => d._id == id).is_deleted;
        setDelId({id, is_deleted});;
        setIsOpenDelete(true);
    }

    const closeDelModal = () => {
        setIsOpenDelete(false);
    }
    
    const showModalStatus = (id) => {
        setDelId(id);
        setIsOpenStatus(true);
    }
    const closeStatusModal = () => {
        setIsOpenStatus(false);
    }
    return(
        <>
            <ToastEx {...props} response={response} show={show} setShow={setShow}/>
            <CrudTable 
                {...props}
                title={title}
                data={respData} 
                columns={columns} 
                loading={loading} 
                showModalStatus={showModalStatus} 
                showModalDel={showModalDel}
                showModalSoftDelete={showModalSoftDelete}
                uploadExcel={uploadExcel}
                edit={DRCEdit}
                toggle={DRCAdd}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
            />
            <ModalDeleteCrud lang={lang} TranslateExp={TranslateExp} del={del} delId={delId} closeDelModal={closeDelModal} isOpenDelete={isOpenDelete}/>
            <ModalStatus lang={lang} TranslateExp={TranslateExp}  changeStatus={changeStatus} delId={delId} closeStatusModal={closeStatusModal} isOpenStatus={isOpenStatus} />
            <ModalSoftDelete lang={lang} TranslateExp={TranslateExp} softDelete={softDelete} sfDeletedId={sfDeletedId} closeSoftDeleteModal={closeSoftDeleteModal} isOpenSoftDelete={isOpenSoftDelete} />
        </>
    )
    
}

export default DRCTable;
