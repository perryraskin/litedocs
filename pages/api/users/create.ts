import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

export default async function(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient({ log: ["query"] })

  try {
    const { user } = req.body
    const { name, email } = user
    const newUser = await prisma.user.create({
      data: {
        name,
        email
      }
    })

    res.status(201)
    res.json({ newUser })
  } catch (err) {
    res.status(500)
    res.json({ error: err.message })
  } finally {
    await prisma.$disconnect()
  }
}
