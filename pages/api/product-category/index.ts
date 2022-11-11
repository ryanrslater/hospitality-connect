import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, ProductCategory, Prisma } from '@prisma/client'



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if (req.method === "POST") {

        const data: Prisma.ProductCategoryCreateInput = req.body

        const prisma = new PrismaClient()

        const db = await prisma.productCategory.create({ data })

        res.status(200).json({ name: 'John Doe' })
    }
    if (req.method === "PATCH") {

        const data: Prisma.ProductUpdateInput = req.body.data

        const id: number = req.body.where

        const prisma = new PrismaClient()

        const db = await prisma.productCategory.update({ where: { id }, data })

        res.status(200).json({ name: 'John Doe' })
    }
    if (req.method === "DELETE") {

        const id: number = req.body.where

        const prisma = new PrismaClient()

        const db = await prisma.productCategory.delete({ where: { id } })

        res.status(200).json({ name: 'John Doe' })
    }
}
