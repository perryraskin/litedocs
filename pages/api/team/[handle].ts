import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient, User } from "@prisma/client"
import auth from "../../../middleware/auth"
import { includes } from "lodash"
import { query } from "express"

export default async function(req: NextApiRequest, res: NextApiResponse) {
  const userAuth = await auth(req, res)
  const user = userAuth as User

  const prisma = new PrismaClient({ log: ["query"] })
  const {
    query: { handle, tag }
  } = req
  console.log(req.query)
  const teamHandle = handle as unknown
  const teamHandleString = teamHandle as string

  const tagName = tag as unknown
  const tagNameString = tagName as string
  try {
    let entryFilters: any = true
    if (tag != "null") {
      entryFilters = {
        where: {
          tagsText: {
            contains: tagNameString
          }
        }
      }
    }

    const team = await prisma.team.findOne({
      where: {
        handle: teamHandleString
      },
      include: {
        Entries: entryFilters,
        Members: true
      }
    })

    const isMember = team.Members.some(m => m.userId === user.id)
    if (!isMember) {
      res.status(401)
      res.json({ authorized: false })
    } else {
      res.status(200)
      res.json({ authorized: true, team })
    }
  } catch (err) {
    res.status(500)
    res.json({ authorized: false, error: err.message })
    console.error("ERROR:", err)
  } finally {
    await prisma.$disconnect()
  }
}
