import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import './style.css'
import ResetPassword from './views/password/reset-password'
import Summary from './views/dashboard/summary'
import AccountSettings from './views/dashboard/account-settings'
import Premium from './views/dashboard/premium'
import ContinueRegistration1 from './views/registration/continue-registration1'
import Home from './views/home'
import ContinueRegistration2 from './views/registration/continue-registration2'
import ComingSoon from './views/coming-soon'
import StartRegistration from './views/registration/start-registration'
import ChangePassword from './views/password/change-password'
import Login from './views/login/login'
import VerifyEmail from './views/verify-email'
import Authorize from './views/dashboard/authorize'

const App = () => {
  return (
    <Router>
      <div>
        <Route component={ResetPassword} exact path="/reset-password" />
        <Route component={Summary} exact path="/summary" />
        <Route component={AccountSettings} exact path="/account-settings" />
        <Route component={Premium} exact path="/premium" />
        <Route
          component={ContinueRegistration1}
          exact
          path="/continue-registration1"
        />
        <Route component={Home} exact path="/" />
        <Route
          component={ContinueRegistration2}
          exact
          path="/continue-registration2"
        />
        <Route component={ComingSoon} exact path="/coming-soon" />
        <Route component={StartRegistration} exact path="/start-registration" />
        <Route component={ChangePassword} exact path="/change-password" />
        <Route component={Login} exact path="/login" />
        <Route component={VerifyEmail} exact path="/onecode" />
        <Route component={Authorize} exact path="/authorize" />
      </div>
    </Router>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
