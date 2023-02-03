import React from 'react'
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './style.css'
import Home from './views/home'
import ResetPassword from './views/password/reset-password'
import Summary from './views/dashboard/summary'
import AccountSettings from './views/dashboard/account-settings'
import Premium from './views/dashboard/premium'
import ComingSoon from './views/coming-soon'
import ChangePassword from './views/password/change-password'
import Login from './views/login/login'
import VerifyEmail from './views/login/verify-email'
import Authorize from './views/dashboard/authorize'
import CreateId from "./views/create-id";

const App = () => {
  return (
    <Router>
        <Routes>
            <Route element={<Home />} exact path="/" />
            <Route element={<ResetPassword />} exact path="/reset-password" />
            <Route element={<Summary />} exact path="/summary" />
            <Route element={<AccountSettings />} exact path="/account-settings" />
            <Route element={<Premium />} exact path="/premium" />
            <Route element={<ComingSoon />} exact path="/coming-soon" />
            <Route element={<CreateId />} exact path="/create-id" />
            <Route element={<ChangePassword />} exact path="/change-password" />
            <Route element={<Login />} exact path="/login" />
            <Route element={<VerifyEmail />} exact path="/onecode" />
            <Route element={<Authorize />} exact path="/authorize" />
        </Routes>
    </Router>
  )
}

const container = document.getElementById('app');
createRoot(container).render(<App />);