import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient, User } from "@prisma/client"
import auth from "../../../../middleware/auth"

export default async function(req: NextApiRequest, res: NextApiResponse) {
  const userAuth = await auth(req, res)
  const user = userAuth as User

  const { method } = req
  const prisma = new PrismaClient({ log: ["query"] })
  const {
    query: { id }
  } = req

  const userId = id as unknown
  const userIdString = userId as string

  if (method === "GET" && userIdString === user.issuer) {
    try {
      const logs = await prisma.log.findMany({
        where: {
          userId: user.id
        },
        include: {
          User: true,
          Entry: {
            include: {
              Team: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      })

      res.status(200)
      res.json({ authorized: true, logs })
    } catch (err) {
      res.status(401)
      res.json({ authorized: false, error: err.message })
    } finally {
      await prisma.$disconnect()
    }
  } else res.json({ authorized: false })
}
