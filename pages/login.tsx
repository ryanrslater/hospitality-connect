import React, { useState } from "react";

const Login = () => {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const submitHandler = async (e: any) => {
        e.preventDefault()
        const user = await fetch('/api/auth/signin', {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            })
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