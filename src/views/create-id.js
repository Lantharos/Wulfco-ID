import React from 'react'

import { Helmet } from 'react-helmet'

import './create-id.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import {AnimatePresence} from "framer-motion";
import RegistrationStart from '../components/registration/registration-start'
import RegistrationNext from "../components/registration/registration-next";
import RegistrationFinish from "../components/registration/registration-finish";
import config from '../config.json'
import cookies from "react-cookies";

const CreateId = () => {
    const [ stage, setStage ] = React.useState(0)
    const [ name, setName ] = React.useState("")

    const switchStage = (nextStage, newData) => {
        if (stage === 0) {
            const message = toast.loading('Creating new session...', { theme: "dark" })
            sessionStorage.setItem("email", newData.email)
            sessionStorage.setItem("password", newData.password)
            toast.update(message, { render: 'Session created!', type: 'success', autoClose: 2000, isLoading: false })

            setStage(nextStage)
        } else if (stage === 1) {
            const message = toast.loading('Saving...', { theme: "dark" })
            setName(newData.name)
            sessionStorage.setItem("name", newData.name)
            sessionStorage.setItem("gender", newData.gender)
            toast.update(message, { render: 'Saved!', type: 'success', autoClose: 2000, isLoading: false })

            setStage(nextStage)
        } else if (stage === 2) {
            const message = toast.loading('Creating your ID...', { theme: "dark" })

            fetch(`${config.api_url}/id/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: sessionStorage.getItem("email"),
                    password: sessionStorage.getItem("password"),
                    name: sessionStorage.getItem("name"),
                    gender: sessionStorage.getItem("gender"),
                    username: newData.username
                })
            }).then((res) => {
                res.json().then((data) => {
                    if (data.success) {
                        toast.update(message, { render: 'ID created!', type: 'success', autoClose: 2000, isLoading: false })
                        cookies.save('secret', data.session.secret, {path: '/', secure: false})
                        cookies.save('token', data.session.token, {path: '/', secure: false})
                        cookies.save('id', data.uuid, {path: '/', secure: false})
                        cookies.save('loggen', data.session.loggen, {path: '/', secure: false})
                        cookies.save('session_id', data.session.session_id, {path: '/', secure: false})
                        window.location.href = '/summary'
                    } else {
                        toast.update(message, { render: 'Failed to create ID!', type: 'error', autoClose: 2000, isLoading: false })
                    }
                })
            }).catch(() => {
                toast.update(message, { type: 'error', render: 'Failed to create ID!', isLoading: false, autoClose: 3000 })
            })
        }
    }

    return (
        <div className="create-id-container">
            <ToastContainer />
            <Helmet>
                <title>Create an ID</title>
                <meta
                    name="description"
                    content="Don't have an ID? No worries! Just create one, today, for free."
                />
                <meta property="og:title" content="Create an ID" />
                <meta
                    property="og:description"
                    content="Wulfco ID is a place where you can create one ID that you will use for all of the services created by Wulfco LLC."
                />
                <meta
                    property="og:image"
                    content="https://aheioqhobo.cloudimg.io/v7/_playground-bucket-v2.teleporthq.io_/39ebfb3d-48ba-4ad3-b4e3-71d35b211205/10f1cb93-1683-40cb-80dc-d58305d2dd58?org_if_sml=1"
                />
            </Helmet>

            <AnimatePresence initial exitBeforeEnter>
                {stage === 0 && <RegistrationStart handler={switchStage} />}
                {stage === 1 && <RegistrationNext handler={switchStage} />}
                {stage === 2 && <RegistrationFinish handler={switchStage} firstname={name.split(" ")[0]} />}
            </AnimatePresence>
        </div>
    )
}

export default CreateId
