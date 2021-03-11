import React, {useEffect, useState} from "react";
import ModalDeleteCrud from '../../../../components/modalDeleteCrud'
import ModalStatus from '../../../../components/modalStatus';
import ModalSoftDelete from "../../../../components/modalSoftDelete";
import ToastEx from "../../../../components/toasts";
import CrudTable from '../../../../components/crudTable'
import {useHistory} from "react-router-dom";
import {userApi} from "../../../../services/userService";

const roles = [
    {
        value:2,
        label: "админ"
    },
    {
        value:3,
        label: "пользователь",
    },
    {
        value:4,
        label: "покупатель"
    },
    {
        value:10,
        label: "DEMO",
    }
]
function UsersCrudTable(props){

  const {lang, TranslateExp, uploadExcel} = props;
  const menu = TranslateExp(lang, "sidebar.Users");
  const title = TranslateExp(lang, "cruds.userList");
  const history = useHistory();
  const columns=[
      {
          Header: TranslateExp(lang, "reg.name"),
          accessor: "first_name",
      },
      {
          Header: TranslateExp(lang, "reg.secName"),
          accessor: "last_name",
      },
      {
          Header: TranslateExp(lang, "reg.compName"),
          accessor: "company_name"
      },
      {
          Header: TranslateExp(lang, "content.role"),
          accessor: "role",
          Cell: ({value}) => {
              const role = roles.find(role => role.value === value);
              return (role)? role?.label : "";
          }
      },
      {
          Header: TranslateExp(lang, "products.mnn"),
          accessor: "company_inn",
      },
      {
          Header: TranslateExp(lang, "reg.phone"),
          accessor: "phone_number",
      }
  ]
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [response, setResponse] = useState('');
  const[isOpenDelete,setIsOpenDelete] = useState(false);
  const[isOpenStatus, setIsOpenStatus] = useState(false);
  const[thisUser, setThisUser] = useState(true);
  const[delId,setDelId] = useState(null);
  const[respData,setRespData] = useState([])
  const[userList,setUserList] = useState([])
  const[filterStatus, setFilterStatus] = useState("all");

  const[sfDeletedId, setSfDeletedId] = useState(undefined);
  const[isOpenSoftDelete, setIsOpenSoftDelete] = useState(false);
    const filter = () => {
      switch(filterStatus){
          case "all":
              userApi.getList().then(resp => { 
                  setRespData(resp.data.data);
                  setLoading(false)
              })
              break;
          case "active":
              userApi.getActiveList().then(resp => { 
                  setRespData(resp.data.data)
                  setLoading(false);
              });
              break;
          case "unactive":
              userApi.getUnactiveList().then(resp => {
                  setRespData(resp.data.data)
                  setLoading(false)
              })
              break;
          case "deleted":
              userApi.getDeletedList().then(resp => {
                  setRespData(resp.data.data)
                  setLoading(false)
              });
              break;
      }
  }

  useEffect(() => {
      setLoading(true);
      filter();
  }, [filterStatus]);
    useEffect(()=>{
        filterData();
    },[respData]);

    const filterData = () => {
        setUserList(respData.filter(item=>item.role!==1));
    };
  const toggle = ()=> {
      history.push("/admin/users/add");
  };
  const edit = (id) => {
      history.push(`/admin/users/update/${id}`);
  };
  function del(id) {
      const is_deleted = respData.find(data => data._id == id).is_deleted;
      userApi.delete(id, {is_deleted: !is_deleted}).then(res=>{
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
      userApi.softDelete(id).then(res => {
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
      userApi.changeStatus(id, {is_active: !is_active}).then(resp => {
          setShow(true);
          setResponse({
              message: resp.data.message.ru,
              status:resp.data.status
          });
          filter();
      });
      closeStatusModal();
  }

  const showModalDel=(id)=>{
      const is_deleted = respData.find(d => d._id === id).is_deleted;
      setDelId({id, is_deleted});;
      setIsOpenDelete(true);
  }
  const showModalSoftDelete = (id) => {
      setSfDeletedId(id);
      setIsOpenSoftDelete(true);
  }

  const closeSoftDeleteModal = () => {
      setIsOpenSoftDelete(false);
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
  // console.log("respData",respData)
  return (
    <>
          <ToastEx {...props}  response={response} show={show} setShow={setShow}/>
          <CrudTable 
              {...props}
              menu={menu}
              title={title}
              thisUser={thisUser}
              data={userList}
              columns={columns} 
              loading={loading} 
              hideImport={true}
              showModalStatus={showModalStatus} 
              showModalDel={showModalDel}
              showModalSoftDelete={showModalSoftDelete}
              edit={edit}
              toggle={toggle}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
          />
          <ModalDeleteCrud lang={lang} TranslateExp={TranslateExp} del={del} delId={delId} closeDelModal={closeDelModal} isOpenDelete={isOpenDelete}/>
          <ModalStatus lang={lang} TranslateExp={TranslateExp} changeStatus={changeStatus} delId={delId} closeStatusModal={closeStatusModal} isOpenStatus={isOpenStatus} />
          <ModalSoftDelete lang={lang} TranslateExp={TranslateExp} softDelete={softDelete} sfDeletedId={sfDeletedId} closeSoftDeleteModal={closeSoftDeleteModal} isOpenSoftDelete={isOpenSoftDelete} />
        
    </>
  );

}

export default UsersCrudTable;
