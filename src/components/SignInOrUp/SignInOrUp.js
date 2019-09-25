import React, { useState } from 'react'
import './styles.css'

export function SignInOrUp({ mode, handleAuth, history }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const SubmitButton = () => {
        if (mode === 'signin') {
            return (
                <input type="submit" value="Sign In" onClick={(e) => attemptAuth(e)} />
            )
        } else if (mode === 'signup') {
            return (
                <input type="submit" value="Sign Up" onClick={(e) => attemptAuth(e)} />
            )
        } else {
            console.log('Incorrect mode used ', mode)
        }
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
        <div className='boundary'>
            <form>
                <div>
                    <label>
                        Username:
                <input type='text'
                            name='username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                <input type='text'
                            name='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                    </label>
                </div>
                <div>{SubmitButton()}</div>
                <div>{error ? error.message : null}</div>
            </form>
        </div>
    )
}