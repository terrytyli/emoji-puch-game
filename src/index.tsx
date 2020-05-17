import React from 'react'
import ReactDOM from 'react-dom'
import { FixVH } from './FixVH'
import App from './App'

const rootElement = document.getElementById('root')
ReactDOM.render(
  <React.StrictMode>
    <>
      <FixVH />
      <App />
    </>
  </React.StrictMode>,
  rootElement
)
