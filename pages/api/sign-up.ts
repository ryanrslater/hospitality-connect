import type { NextApiRequest, NextApiResponse } from 'next'

import { Auth } from '../../lib/Auth'
import { Prisma, Account } from '.prisma/client'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
  
    if (req.method !== "POST") return res.status(400).json({ name: 'John Doe' })
    const {username, password, confirmPassword} = JSON.parse(req.body)
    const auth = new Auth()

    try {
        const user = await auth.signUp(username, password, confirmPassword)
        console.log(user)
        return res.status(201).json(user)
    } catch (error) {
        console.log('err', error)
        return res.status(400).json({ error: error })
    }

}
