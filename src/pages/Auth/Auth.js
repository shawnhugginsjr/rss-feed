import React from 'react'
import { SignInOrUp } from '../../components/SignInOrUp'

export function Auth({ mode, handleAuth, history }) {
    
    return (
        <div>
            on page!
            <SignInOrUp mode={mode} handleAuth={handleAuth} history={history} />
        </div>
    )
}