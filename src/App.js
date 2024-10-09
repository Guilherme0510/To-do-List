import React from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { Login } from './Pages/Login'
import { Home } from './Pages/Home';

const App = () => {
  return (
 
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/home' element={<Home />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
