import React, { useState } from 'react'
import { useAsyncDebounce } from 'react-table'
import st from './globalFilter.module.scss'
export const GlobalFilter = ({ filter, setFilter, loading, lang, TranslateExp }) => {

  const [value, setValue] = useState(filter)
  const onChange = useAsyncDebounce(value => {
    setFilter(value || undefined)
  }, 1000)
  return (
    <div className={st.global__filter}>
      <label className={st.label}>{TranslateExp(lang, "content.search")}: </label>
      <input disabled={(loading)?true:false} className={st.global__filter__input}
        value={value || ''}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
      />
    </div>
  )
}
