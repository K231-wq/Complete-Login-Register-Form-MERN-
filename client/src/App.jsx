import React from 'react'
import { Routes, Route } from 'react-router-dom'
import EmailVerify from './page/EmailVerify'
import ResetPassword from './page/ResetPassword'
import Home from './page/Home';
import Login from './page/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
      <div>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path='/email-verify' element={<EmailVerify />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
    </>

  )
}

export default App