import React, {useState, useEffect} from 'react'
import {Modal, Form} from 'react-bootstrap'
import st from './modalInfo.module.scss'

export default function ModalInfo(props) {
    const {data, show, hide, price, dateLen, lang, TranslateExp} = props;
    const [period, setPeriod] = useState(1);
    const getTextHead=(column)=>{
        return (column?.HeaderTitle !== undefined)?column.HeaderTitle:column.Header
    }
    useEffect(() => setPeriod(1), [show])
    const getHtml=(data,text)=>{
        return(
            <p className='m-0'>{data?.render('Cell')} {text}</p>
        )
    }
    const writeGroupRow=(data, index, text)=>{
        let x,x1 = 0;
        if(period > 2) x1 = 1;
        if(dateLen === 1) x = 1;
        if(dateLen === 2) x = 3;
        if(dateLen === 3) x = 5;
        if(dateLen === 4) x = 6;

        return(
            <div className={`${st.group}`}>
                <h6 className='mb-0 text-center'>{text}({getHtml(data[index+x],'')})</h6>
                <p className='m-0 text-left' >{getHtml(data[index+2*x-x1],'')}</p>
            </div>
        )
    }
    const writeSingleRow=(header, text, price)=>{
        return(
            <div className={`${st.single} row d-flex align-items-center`}>
                <h6 className='m-0'>{header}</h6>
                <p className='m-0 ml-3 text-secondary'>{text} {price}</p>
            </div>
        )
    }
    const getBlock=(colId, index)=>{
        return(
            (+colId?.per === +period)?
                (colId?.group)?
                    (colId?.text)?
                    <div className='col-md-4 mb-3'>
                        <div>
                            {writeGroupRow(data, index, colId.text)}
                        </div>
                    </div> 
                    :''
                :''
            :''
        )
    }
    return (
        <div className={st.body}>
        {data?
            <Modal
                show={show}
                onHide={hide}
                dialogClassName={st.modalDialog}
                contentClassName={st.modal__content}
            >
                <Modal.Header className='d-flex mx-4 align-items-center' closeButton>
                    <h3 className='m-0'>{data[0].value}</h3>  
                    <Form>
                        <Form.Group className='m-0 ml-5 pl-1 d-flex align-items-center' style={{border: '1px solid #ced4da', borderRadius: '5px'}}>
                            <Form.Label className='my-0 mr-2'>{TranslateExp(lang, "content.period")}:</Form.Label>
                            <Form.Control 
                                as="select" 
                                value={period}
                                onChange={(e)=>setPeriod(e.target.value)}
                                style={{border: '0', borderLeft: '1px solid #ced4da', borderTopLeftRadius: 0,borderBottomLeftRadius: 0, cursor: 'pointer'}}
                            >
                                <option className='font-weight-bold' value={1}>1</option>
                                <option className={(dateLen >= 2)?'font-weight-bold':''} disabled={(dateLen < 2)} value={2}>2</option>
                                <option className={(dateLen >= 3)?'font-weight-bold':''} disabled={(dateLen < 3)} value={3}>3</option>
                                <option className={(dateLen >= 4)?'font-weight-bold':''} disabled={(dateLen < 4)} value={4}>4</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Header>
                <Modal.Body className ='pt-2 pb-0 mx-4 mb-3'>     
                    {data.map((key)=>{
                        const colId = key.column?.HeaderVal;
                        const isHead = getTextHead(key.column);
                        return(
                            (+colId?.per === +period || colId?.per === 0)?
                                (!colId?.group)?
                                    (colId.role==='price')?
                                        writeSingleRow(isHead , key?.render('Cell'), price)
                                    :   writeSingleRow(isHead , key?.render('Cell'), '')
                                :''
                            :''
                        )
                    })    
                    }
                    
                    <div className='row mt-3'>
                    {
                        data?.map((key, index)=>{
                            const colId = key.column?.HeaderVal;
                            if(index < 3) return getBlock(colId, index); else return;
                            })
                    }
                    </div>
                    <div className='row'>
                    {
                        data?.map((key, index)=>{
                            const colId = key.column?.HeaderVal;
                            if(index > 2) return getBlock(colId, index); else return;
                            })
                    }
                    </div>
                </Modal.Body>
            </Modal>  
        :""    
        }
        </div>
        
    )
}
