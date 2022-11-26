import type { NextApiRequest, NextApiResponse } from 'next'

import { Auth } from '../../../lib/Auth'
import { Prisma, Account } from '.prisma/client'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if (req.method !== "POST") return res.status(400).json({ name: 'John Doe' })
    const username: string = req.body.account
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword
    const auth = new Auth()

    try {
        const user = await auth.signUp(username, password, confirmPassword)

        return res.status(201).json(user)
    } catch (err) {
        return res.status(400).json({ error: err })
    }

}
