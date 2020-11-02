import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

export default async function(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient({ log: ["query"] })
  const {
    query: { id }
  } = req

  const entryId = id as unknown
  const entryIdInt = entryId as string
  try {
    const entry = await prisma.entry.findOne({
      where: {
        id: parseInt(entryIdInt)
      }
    })

    res.status(200)
    res.json({ entry })
  } catch (err) {
    res.status(500)
    res.json({ error: err.message })
  } finally {
    await prisma.$disconnect()
  }
}
