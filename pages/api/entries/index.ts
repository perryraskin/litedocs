import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

export default async function(req: NextApiRequest, res: NextApiResponse) {
  // const prisma = new PrismaClient({ log: ["query"] })

  // try {
  //   const entries = await prisma.entry.findMany({
  //     // where: {
  //     //   deleted: false
  //     // },
  //     orderBy: {
  //       createdAt: "asc"
  //     }
  //   })

  //   res.status(200)
  //   res.json({ entries })
  // } catch (err) {
  //   res.status(500)
  //   res.json({ error: err.message })
  // } finally {
  //   await prisma.$disconnect()
  // }

  res.status(400)
  res.json({ message: "Not found" })
}
