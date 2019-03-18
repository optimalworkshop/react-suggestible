import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import Suggestible from '../../src/'
import COUNTRIES from './countries'
import './example.css'

const Example = () => {
  const [text, setText] = useState('')

  return (
    <Suggestible
      value={text}
      options={COUNTRIES}
      trigger="#"
      minPrefix={1}
      rows={6}
      onChange={setText}
      autoFocus
    />
  )
}

ReactDOM.render(<Example />, document.getElementById('root'))
