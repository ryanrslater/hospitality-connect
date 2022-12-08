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

    const user = await auth.confirmAccount(body.username, body.code)

    if (user.error) return res.status(400).json({ error: user.error })

    if (!user.sub) return res.status(200).json({ error: 'John Doe' })
    
    const account = await acc.create(body.username, user.sub, body.email,)

    res.status(200).json({ success: true })
    return res
}
