import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Product, Prisma, AccountType, AccountStatus } from '@prisma/client'



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if (req.method === "POST") {

        const { slug, title, description } = req.body

        const data: Prisma.PostCreateInput = {
            slug,
            title,
            description,
            accounts: {
                connect: { id: 1 }
            },

        }

        const prisma = new PrismaClient()

        const db = await prisma.post.create({ data })

        res.status(200).json({ name: 'John Doe' })
    }
    if (req.method === "PATCH") {

        const data: Prisma.PostUpdateInput = req.body.data

        const id: number = req.body.where

        const prisma = new PrismaClient()

        const db = await prisma.post.update({ where: { id }, data })

        res.status(200).json({ name: 'John Doe' })
    }
    if (req.method === "DELETE") {

        const id: number = req.body.where

        const prisma = new PrismaClient()

        const db = await prisma.post.delete({ where: { id } })

        res.status(200).json({ name: 'John Doe' })
    }
}
