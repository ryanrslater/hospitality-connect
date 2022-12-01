// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Auth } from '../../../lib/Auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
   const auth = new Auth()
   const body = JSON.parse(req.body)
  
    const user = await auth.signIn(body.username, body.password, req, res) 
  
  res.status(200).json({ name: 'John Doe' })
  return res
}
