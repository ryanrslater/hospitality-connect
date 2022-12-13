// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import NextCognito from 'nextcognito'
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const nextcognito = new NextCognito()
    const body = JSON.parse(req.body)

    try {
        await nextcognito.confirmSignUp(body.username, body.code)
        return res.status(200).json({ success: true })
    } catch (err) {
        return res.status(200).json({ error: err })
    }

}
