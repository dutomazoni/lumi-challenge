import './App.css'
import pdfToText from 'react-pdftotext'
import { api } from './Services/Api'
import { useState } from 'react'
import { useScreenSize } from './Services/MediaQuery.js'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import {
  BrowserRouter as Router, Route, Routes,
} from 'react-router-dom'
import Dashboard from './Pages/Dashboard.jsx'
import Invoices from './Pages/Invoices.jsx'
import Header from './Components/Header.jsx'

function App () {
  const { isLarge } = useScreenSize()

  return (
    <>
      {isLarge ? <ToastContainer/> : <ToastContainer
        toastStyle={{ margin: 'auto', fontSize: '1.3rem', height: '10vmax' }}/>}
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/invoices" element={<Invoices/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
