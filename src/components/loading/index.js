import React from 'react';
import st from './loading.module.scss';

function Loading () {

    return(
        <div className={st.loading}>
            <div className={st.loader}>
                <div className={st.face}>
                    <div className={st.circle}>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Loading;