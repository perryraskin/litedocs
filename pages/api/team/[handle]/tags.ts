import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient, User } from "@prisma/client"
import auth from "../../../../middleware/auth"

export default async function(req: NextApiRequest, res: NextApiResponse) {
  const userAuth = await auth(req, res)
  const user = userAuth as User

  const prisma = new PrismaClient({ log: ["query"] })
  const {
    query: { handle, search }
  } = req
  console.log(req.query)

  const teamHandle = handle as unknown
  const teamHandleString = teamHandle as string

  const searchQuery = search as unknown
  const searchQueryString = searchQuery as string
  try {
    const team = await prisma.team.findOne({
      where: {
        handle: teamHandleString
      },
      include: {
        Members: true
      }
    })

    const isMember = team.Members.some(m => m.userId === user.id)
    if (!isMember) {
      res.status(401)
      res.json({ authorized: false })
    }
    //return tags if user is part of the team
    else {
      const tags = await prisma.tag.findMany({
        where: {
          name: {
            contains: searchQueryString
          },
          Entry: {
            Team: {
              handle: teamHandleString
            }
          }
        },
        distinct: ["name"],
        orderBy: {
          name: "asc"
        }
      })

      res.status(200)
      res.json({ authorized: true, tags })
    }
  } catch (err) {
    res.status(500)
    res.json({ error: err.message })
  } finally {
    await prisma.$disconnect()
  }
}
