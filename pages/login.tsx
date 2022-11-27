import React, { useState } from "react";
import { signIn } from "next-auth/react"

const Login = () => {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const submitHandler = async (e: any) => {
        e.preventDefault()
        const user = await signIn('credentials', {
            username,
            password
        })
    }
    return (
        <div>
            <form onSubmit={submitHandler}>
                <input value={username} onChange={(e) => setUsername(e.target.value)} />
                <input value={password} onChange={(e) => setPassword(e.target.value)} type='password' />
                <button type="submit">click</button>
            </form>
        </div>
    )
}

export default Login