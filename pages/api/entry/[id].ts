import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient, User } from "@prisma/client"
import auth from "../../../middleware/auth"
import { includes } from "lodash"

export default async function(req: NextApiRequest, res: NextApiResponse) {
  const userAuth = await auth(req, res)
  const user = userAuth as User

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
      },
      include: {
        Author: true,
        Team: {
          include: {
            Members: true
          }
        }
      }
    })

    const isMember = entry.Team
      ? entry.Team.Members.some(m => m.userId === user.id)
      : false
    console.log(entry.Author, user)
    if (entry.Author.issuer !== user.issuer && !isMember) {
      res.status(401)
      res.json({ authorized: false })
    } else {
      res.status(200)
      res.json({ authorized: true, entry })
    }
  } catch (err) {
    res.status(500)
    res.json({ authorized: false, error: err.message })
  } finally {
    await prisma.$disconnect()
  }
}
