import React from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { Login } from './Pages/Login'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const App = () => {
  return (
 
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
