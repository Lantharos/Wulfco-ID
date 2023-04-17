import React from 'react'

import AuthorizedApp from './page_components/authorized-app'
import './authorized-apps.css'
import {AnimatePresence} from "framer-motion";
import ConfirmationDialog from "../dialogs/confirmation-dialog";

const AuthorizedApps = (props) => {
    const [confirmDeauthorize, setConfirmDeauthorize] = React.useState({})

    const deauthorizeApp = (app_id) => {
        const app = props.userData.connections.oauth.find((app) => {
            return app.app_id === app_id
        })

        if (app === undefined) {
            return
        }

        setConfirmDeauthorize({
            after: function() {

            }
        })
    }

    const loadApps = () => {
        if (props.userData.connections.oauth === undefined) {
            return
        }

        const apps = props.userData.connections.oauth

        return apps.map((app) => {
            return <AuthorizedApp app_id={app.app_id} app_name={app.app_name} app_about={app.about_app} deauthorize={deauthorizeApp} app_permissions={app.app_permissions} />
        })
    }

    return (
        <div className="authorized-apps-content">
            <AnimatePresence>
                {confirmDeauthorize.after && <ConfirmationDialog title={"Deauthorize Application"} message={"This will remove the link between your ID and the application"} setConfirmDeauthorize={setConfirmDeauthorize} confirmDeauthorize={confirmDeauthorize} /> }
            </AnimatePresence>
            <h1 className="authorized-apps-text notselectable">Authorized Apps</h1>
            <div className="authorized-apps-container">
            <span className="authorized-apps-text1 notselectable">
              APPLICATIONS & CONNECTIONS
            </span>
                <span className="authorized-apps-text2 notselectable">
                  Here's all the apps that are doing cool stuff behind the scenes to make your experience better, if anything gets too chilly you can remove them at any time.
                </span>
            </div>
            {loadApps()}
        </div>
    )
}

export default AuthorizedApps
