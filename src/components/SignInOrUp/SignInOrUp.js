import React, { useState } from 'react'
import './styles.css'
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap'

export function SignInOrUp({ mode, handleAuth, history }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const Header = () => {
        let headerText = ''
        if (mode === 'signin') {
            headerText = 'Sign In'
        } else if (mode === 'signup') {
            headerText = 'Sign Up'
        } else {
            console.log('Incorrect mode used ', mode)
        }

        return(
            <>
            <h2>{headerText}</h2>
            <hr/>
            </>
        )
    }

    const SubmitButton = () => {
        let buttonText = ''
        if (mode === 'signin') {
            buttonText = 'Sign In'
        } else if (mode === 'signup') {
            buttonText = 'Sign Up'
        } else {
            console.log('Incorrect mode used ', mode)
        }
        return (
            <Button value="Sign In" onClick={(e) => attemptAuth(e)} block>
                {buttonText}
            </Button>
        )
    }

    const attemptAuth = async (event) => {
        event.preventDefault()
        console.log('attempting auth')
        const urlPath = mode === 'signin' ? '/login' : '/signup'
        if (!username || !password) {
            setError({
                message: 'Please enter both a username and password'
            })
            return
        }
        const user = {
            user: {
                username: username,
                password: password
            }
        }
        try {
            console.log('auth to route', urlPath)
            const res = await fetch(urlPath, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            const body = await res.json()
            if (body.error) {
                setError({
                    message: body.error.message
                })
                return
            }

            handleAuth(body)
            history.push('/')
        } catch (error) {
            const errorMessage = mode === 'signin' ? 'Can not login to user' : 'User can not be created'
            setError({
                message: errorMessage
            })
            return
        }
    }

    return (
        <div className='form-container'>
            <Header />
            <Form>
                <FormGroup>
                    <Label for="username">Username</Label>
                    <Input
                        type="text"
                        name="username"
                        id="username"
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username" />
                </FormGroup>
                <FormGroup>
                    <Label for="Password">Password</Label>
                    <Input
                        type="password"
                        name="password"
                        id="username"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password" />
                </FormGroup>
                <SubmitButton />
                <div className='error'>{error ? error.message : null}</div>
            </Form>
        </div>
    )
}