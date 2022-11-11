import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Product, Prisma, AccountType, AccountStatus } from '@prisma/client'



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if (req.method === "POST") {

        const data: Prisma.ProductCreateInput = req.body

        const prisma = new PrismaClient()

        const db = await prisma.product.create({ data })

        res.status(200).json({ name: 'John Doe' })
    }
    if (req.method === "PATCH") {

        const data: Prisma.ProductUpdateInput = req.body.data
        const id: number = req.body.where

        const prisma = new PrismaClient()

        const db = await prisma.product.update({ where: { id }, data })

        res.status(200).json({ name: 'John Doe' })
    }
    if (req.method === "DELETE") {

        const id: number = req.body.where

        const prisma = new PrismaClient()

        const db = await prisma.product.delete({ where: { id } })

        res.status(200).json({ name: 'John Doe' })
    }
}
