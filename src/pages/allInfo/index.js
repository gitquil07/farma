import React,{useState, useEffect} from 'react'
import CompanyAnalyze from '../analyze/companiesAnalyze'
import DrugFormsAnalyze from '../analyze/dfAnalyze'
import DistributorAnalyze from '../analyze/distAnalyze'
import ManufacturerAnalyze from '../analyze/manufacturerAnalyze'
import MnnAnalyze from '../analyze/mnnAnalyze'
import AllInfoAnalyze from '../analyze/namesAllAnalyze'
import TrademarkAnalyze from '../analyze/tradeMarkAnalyze'
export default function AllInfo(props) {
    const [currentPageTab, setCurrentPageTab] = useState('drugs/all');
    const [firstAll, setFirstAll] = useState(true);
    const [date, setDate] = useState([{started:'', ended:''}]),
          [currentPage, setCurrentPage] = useState(null);
    function setFirstAllFunc(bool) {
        setFirstAll(bool);
    }
    useEffect(()=>{
        switch(currentPageTab){
            case 'companies':
                setCurrentPage(<CompanyAnalyze 
                    handleSelectTab={handleSelectTab}
                    allInfo={true} 
                    setFirstAll={setFirstAllFunc}
                    firstAll={firstAll}
                    setDateAll={setDateAll} 
                    currentPageTab={currentPageTab}
                    dateAll={date}
                    {...props}
                    />); 
                break;
            case 'drugs/forms': 
                setCurrentPage(<DrugFormsAnalyze 
                    handleSelectTab={handleSelectTab} 
                    allInfo={true} 
                    setFirstAll={setFirstAllFunc} 
                    firstAll={firstAll}
                    setDateAll={setDateAll} 
                    currentPageTab={currentPageTab}
                    dateAll={date}
                    {...props}
                    />); 
                break;
            case 'distributors':  
                setCurrentPage(<DistributorAnalyze 
                    handleSelectTab={handleSelectTab} 
                    allInfo={true} 
                    setFirstAll={setFirstAllFunc} 
                    firstAll={firstAll}
                    setDateAll={setDateAll} 
                    currentPageTab={currentPageTab}
                    dateAll={date}
                    {...props}
                    />); 
                break;
            case 'manufacturers':  
                setCurrentPage(<ManufacturerAnalyze 
                    handleSelectTab={handleSelectTab} 
                    allInfo={true} 
                    setFirstAll={setFirstAllFunc} 
                    firstAll={firstAll}
                    setDateAll={setDateAll} 
                    currentPageTab={currentPageTab}
                    dateAll={date}
                    {...props}
                    />); 
                break;
            case 'inn':  
                setCurrentPage(<MnnAnalyze 
                    handleSelectTab={handleSelectTab} 
                    allInfo={true} 
                    setFirstAll={setFirstAllFunc} 
                    firstAll={firstAll}
                    setDateAll={setDateAll} 
                    currentPageTab={currentPageTab}
                    dateAll={date}
                    {...props}
                    />); 
                break;
            case 'trademarks':  
                setCurrentPage(<TrademarkAnalyze 
                    handleSelectTab={handleSelectTab} 
                    allInfo={true} 
                    setFirstAll={setFirstAllFunc} 
                    firstAll={firstAll}
                    setDateAll={setDateAll} 
                    currentPageTab={currentPageTab}
                    dateAll={date}
                    {...props}
                    />); 
                break;
            case 'drugs/all':  
                setCurrentPage(<AllInfoAnalyze 
                    handleSelectTab={handleSelectTab} 
                    allInfo={true} 
                    setFirstAll={setFirstAllFunc} 
                    firstAll={firstAll}
                    setDateAll={setDateAll} 
                    currentPageTab={currentPageTab}
                    dateAll={date}
                    {...props}
                    />); 
                break;
        }
    },[currentPageTab, props.lang])
    function setDateAll(data){
        setDate(data);
    }

    function handleSelectTab(obj){
        setCurrentPageTab(obj.value);
        
    }
    return currentPage
}