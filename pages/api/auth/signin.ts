// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Auth } from '../../../lib/Auth'
import NextCognito from 'nextcognito'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

   const body = JSON.parse(req.body)

  const auth = new NextCognito()

  const user = auth.signIn(body.username, body.password, res)
  
  res.status(200).json({ name: 'John Doe' })
  return res
}
