function formatter(str){
    str = str.split(' ').join('');
    let bool = true;
    return str.split('').map((key, index)=>{
        if(isNaN(key)){
            if((key==='.')){
                if(bool){
                    bool = false;
                    if(index == 0) return '0.'; else  return '.';
                } else return '';
            }  else return '';
        } else {
            return key;
        }
    }).join('');
}
export function NumberToStr(Number){
    if(Number !== undefined){
        let string =Number.toString();
        const arr = string.split('.');
        let str = "";
        let count = 0;
        let temp = "";
        if(arr[0].length <= 3) return Number;
        for (let j = arr[0].length-1; j >= 0 ; j--) {
            count++;
            temp = arr[0][j] + temp;
            if(count === 3){
                if(str.length > 0){
                    str = temp +' '+ str;
                } else {
                    str = temp;
                }
                temp = '';
                count = 0;
            }
        }
        if(temp.length > 0) str = temp +' '+ str;
        if(arr.length > 1) str = str+'.'+arr[1].slice(0,2);
        return str;    
    } else {
        return '';
    }
}
export function StrtoNumber(Str){
    return formatter(Str.toString());
}
export function getId(rating, id){
    for (let i = 0; i < rating.length; i++) {
        if(id === rating[i].id) return i+1;
    }
    return NaN;
}

export function CalculatePercent (a,b) {
    return +((a/b)*100).toFixed(2);
}

function Sorting (e) {
    e.sort((a,b) => {return b-a});
    // return e;
}

function CreateSortedData (temp,data,newData) {
    temp.map(e => {
        data.map(data => {
            if(data.usd == e) newData.push(data);
        })
    });
}

export function CalculateTops (data,price, count){
    const temp = [];
    const newData = [];
    const perc = [];
    data.map(e => temp.push(e.usd));
    Sorting(temp);
    CreateSortedData(temp,data,newData);
    newData.map(e => perc.push(Math.round((e.usd*10000)/price)/100));
    newData.map((e,i) => {e.perc = perc[i];})

    data = [];
    newData.map((e,i) => {
        if(i < count) {
            data.push(e);
        }
        else return 0;
    })
    return data;
}

export function GetTops(Header, accessor,noData){
    return {
        show: false,
        Header: Header,
        accessor: accessor,
        Cell:(props) => {
            if(props.value?.length){
                return props.value.map(key=>{
                    return <div className='m-0'>{key['name_uz']}={key.perc} % </div>
                })
            } else {
                return noData
            }
        }
    }
    
}
export function GetDiffferens(value, st){
    if(value){
        return (
            <>
                <i className={` ${(value > 0)? 
                                `${st.green} fa-arrow-up`:`${st.red} fa-arrow-down`} fas`}/> 
                {NumberToStr(Number(value).toFixed(2))}
            </>
        )
    } else {
        return (
        <>
            <i className={`${st.blue} fas fa-equals`}/>
            0.00
        </>
        )
    }
}
export function MakeDifferenceObj(Header,accessor, st){
    return {
        show: false,
        Header: Header,
        accessor: accessor,
        Cell:(props) => GetDiffferens(props.value, st)
    }
}
export function MakeObj(Header, accessor, fixed, ret, show){
    return {
        show: (show)?true:false,
        Header: Header,
        accessor: accessor,
        Cell:(props) => {
            if(props.value){
                return NumberToStr(Number(props.value).toFixed(fixed))+ ret;
            } else {
                return (0).toFixed(fixed) + ret;
            }
        }
    }
}
export function DateFormat(dateProp){
    const parsedDate = new Date(dateProp);
    let date = parsedDate.getDate().toString();
    let month = parsedDate.getMonth()+1;
    month = month.toString();
    if(date.length == 1) date = '0'+ date;
    if(month.length == 1) month = '0'+ month;
    const dateStr = date+'/'+month+'/'+parsedDate.getFullYear(); 
    return dateStr;
}
export function ExcelCells(number){
    if(number >= 26){
        return (String.fromCharCode(65+Math.floor(number/26)-1) + String.fromCharCode(65+number%26))
    } else {
        return String.fromCharCode(65+number);
    }
}
export function customFilter(option, searchText) {
    if (
        option.label.toLowerCase().includes(searchText.toLowerCase())
    ) {
        return true;
    } else {
        return false;
    }
}