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
import PrivacyPolicy from "./views/legal/privacy-policy";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";
import * as Sentry from "@sentry/react";

Sentry.init({
    dsn: process.env.REACT_APP_DSN,
    integrations: [
        new Sentry.BrowserTracing({
            tracePropagationTargets: ["localhost", /^https:\/\/id\.wulfco\.xyz/],
        }),
        new Sentry.Replay(),
    ],
    tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_AKEY,
    authDomain: "wulfco-id.firebaseapp.com",
    projectId: "wulfco-id",
    storageBucket: "wulfco-id.appspot.com",
    messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const firebaseApp = initializeApp(firebaseConfig);
getAnalytics(firebaseApp);
getPerformance(firebaseApp);

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
            <Route element={<PrivacyPolicy />} exact path="/privacy-policy" />
        </Routes>
    </Router>
  )
}

const container = document.getElementById('app');
createRoot(container).render(<App />);