import ciDictionary from "../../langs/ci/ci";
import ruDictionary from "../../langs/ru/ru";
import enDictionary from "../../langs/en/en";
import {getText}  from "../../utils/getText";

export default  function Translate(lang,langRoute){
    let text;
    switch(lang){
        case "рус":
            text = getText(ruDictionary, langRoute);
            break;
        case "eng":
            text = getText(enDictionary, langRoute);
            break;
        case "ўзб":
            text = getText(ciDictionary, langRoute);
            break;
        default:
    }
    return text;
}
