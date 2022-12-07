// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Auth } from '../../../lib/Auth'
import { Account } from '../../../lib/Account'
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const auth = new Auth()
    const acc = new Account()
    const body = JSON.parse(req.body)

    const user = await auth.signUp(body.username, body.email, body.password, body.confirmPassword)

    if (!user.sub) return res.status(200).json({ error: 'John Doe' })
    
    const account = await acc.create(body.username, user.sub, body.email,)

    res.status(200).json({ name: 'John Doe' })
    return res
}
