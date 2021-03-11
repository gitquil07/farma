import React from "react";
import FileSaver from "file-saver";
import * as ExcelJs from "exceljs";
import {ExcelCells} from '../../utils'
const ExportExcel = ({ tableData, fileName,loading, lang, TranslateExp}) => {
  const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fTableData=(columns)=>{
      const arr = [];
      tableData.forEach(element => {
        const temp = {};  
        columns.forEach((key,id) => 
        {
          const text = key.column
          const value = element.cells[id].value
          
          if(typeof(value) === 'object'){
              temp[text.id] = (value.map(v => `${v.name_uz} = ${v.perc} %`)).join("\r");
          } else {
            if(value === undefined || value === ""){
              temp[text.id] = TranslateExp(lang, "content.noData")
            } else {
              temp[text.id] = value;              
            }
          }
        })
        arr.push(temp);
      });
      return arr;
    }
  
    const fWscols=(columns)=>{
      console.log(tableData);
      const temp=[];
      columns.forEach((key, id)=>{
        const text = key.column
        temp.push(
          Math.max(
            ...tableData.map(item => {
              const value = item.cells[id].value   
              if(typeof(value) === 'object'){
                console.log('sssssssss', value);
                return Math.max(
                  ...value.map(key=>{
                    return key.name_uz.length + 12;
                  })
                  )
              } else {
                if(value){
                  return value.toString().length + 4;
                } else {
                  return 12;
                }
              }
              }),
            ((text?.HeaderTitle !== undefined)?text.HeaderTitle.length + 5:text.Header.length + 5)
          )
        )
      })
      console.log(temp);
      return temp;
    }
    const fHeading=(columns)=>{
      const temp=[];
      columns.forEach((key)=>{
        const text = key.column;
        const obj={};
        obj.header = (text?.HeaderTitle !== undefined)?text.HeaderTitle:text.Header; 
        obj.key = text.id;
        temp.push(obj);
      })
      return temp;
    }

    const  exportToExcel=(fileName)=>{
      const columns = tableData[0].cells;
      let workbook = new ExcelJs.Workbook()
      let worksheet = workbook.addWorksheet('Sheet')
      const Headers = fHeading(columns);
      const data = fTableData(columns);
      const wscols = fWscols(columns);
      worksheet.columns = [...Headers]
      worksheet.columns.forEach((column,index) => {
        column.width = wscols[index];
      })
      worksheet.addRows(data)
      worksheet.getRow(1).font = {bold: true, 'color': {argb:'000000'}, 'name': 'Calibri'}
      data.forEach((key, id)=>{
        Object.keys(key).forEach((objKey, index)=> {
            const text = `${ExcelCells(index)}${id+2}`; 
            worksheet.getCell(text).border = {
              top: {style:'hair', color:{argb:'0000FF00'}},
              left: {style:'hair', color:{argb:'0000FF00'}},
              bottom: {style:'hair', color:{argb:'0000FF00'}},
              right: {style:'hair', color:{argb:'0000FF00'}}  
            };
            worksheet.getCell(text).alignment = { wrapText: true };
        })
      })
      console.log(worksheet);

      workbook.xlsx.writeBuffer().then(data => {
        const blob = new Blob([data], { type: fileType }); 
        FileSaver.saveAs(blob, fileName);
       });
    }
  return (
     
    <button
        className={(loading) ? 'disabled' : ""}
        onClick={e => exportToExcel(fileName)}
    >
        <i className="far fa-file-excel mr-3" />
        Export XLSX
    </button>
  );
};

export default ExportExcel;