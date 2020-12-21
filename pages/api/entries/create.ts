import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient, User } from "@prisma/client"
import auth from "../../../middleware/auth"

export default async function(req: NextApiRequest, res: NextApiResponse) {
  const userAuth = await auth(req, res)
  const user = userAuth as User

  const prisma = new PrismaClient({ log: ["query"] })

  try {
    const { entry } = req.body
    const { title, tagsText, body, code, handle } = entry

    let entryData = {
      data: {
        title,
        tagsText,
        body,
        code,
        dateUpdated: new Date(),
        Author: {
          connect: {
            issuer: user.issuer
          }
        },
        Team: undefined
      }
    }
    if (handle) {
      //check if user is a member of the team
      const team = await prisma.team.findOne({
        where: {
          handle
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
      //entry can only be submitted to team if user is a member
      else {
        entryData = {
          data: {
            title,
            tagsText,
            body,
            code,
            dateUpdated: new Date(),
            Author: {
              connect: {
                issuer: user.issuer
              }
            },
            Team: {
              connect: {
                handle: handle
              }
            }
          }
        }
      }
    }

    const newEntry = await prisma.entry.create(entryData)

    const newTags = await handleAddTags(prisma, newEntry, tagsText)

    //log history record
    const entryHistory = await prisma.entryHistory.create({
      data: {
        title,
        tagsText,
        body,
        code,
        Entry: {
          connect: {
            id: newEntry.id
          }
        }
      }
    })

    const log = await prisma.log.create({
      data: {
        note: "Created document",
        User: {
          connect: {
            id: user.id
          }
        },
        EntryHistory: {
          connect: {
            id: entryHistory.id
          }
        },
        Entry: {
          connect: {
            id: newEntry.id
          }
        },
        Team: {
          connect: {
            id: newEntry.teamId
          }
        }
      }
    })

    res.status(201)
    res.json({ entryResponse: newEntry, newTags })
  } catch (err) {
    res.status(500)
    res.json({ error: err.message })
  } finally {
    await prisma.$disconnect()
  }
}

async function handleAddTags(prisma, newEntry, tagsText) {
  const tagArray = tagsText.split(",")
  let newTags = []

  tagArray.forEach(tag => {
    if (tag.length > 0)
      prisma.tag
        .create({
          data: {
            Entry: {
              connect: {
                id: newEntry.id
              }
            },
            name: tag
          }
        })
        .then(res => {
          newTags.push(res)
        })
  })

  return newTags
}
