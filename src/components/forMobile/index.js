import react from "react";
import st from "./forMobile.module.scss";
import logo from "../sideBar/pharm.png";
import googlePlay from "./googlePlay.png";
import appStore from "./appStore.png";

function ForMobile(){
    return <div className={st.mobileBack}>
          <div className={st.message}>
            <img src={logo} />
            <p className={st.textDesc}>
             Если вы хотите попробовать мобильную версию установите 
             приложение
            </p>
            <span className={st.download}>cкачать приложение</span>
            <p>
              <a href="#">
                <img src={googlePlay} className={st.googlePlayLink}/>
              </a>  
              <a href="#">
                <img src={appStore} className={st.appStoreLink}/>
              </a>
            </p>

          </div>
      </div>
}

export default ForMobile;