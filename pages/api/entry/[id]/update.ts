import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient, User } from "@prisma/client"
import auth from "../../../../middleware/auth"

export default async function(req: NextApiRequest, res: NextApiResponse) {
  const userAuth = await auth(req, res)
  const user = userAuth as User

  const prisma = new PrismaClient({ log: ["query"] })
  const {
    query: { id }
  } = req

  const entryId = id as unknown
  const entryIdString = entryId as string

  try {
    const { entry } = req.body
    const { title, tagsText, body, code } = entry
    console.log(req.body)

    const existingEntry = await prisma.entry.findOne({
      where: {
        id: parseInt(entryIdString)
      },
      include: {
        Author: true
      }
    })

    if (existingEntry.Author.issuer !== user.issuer) {
      res.status(401)
      res.json({ authorized: false })
    }

    const tagsResponse = await handleUpdateTags(prisma, entryIdString, tagsText)

    const entryResponse = await prisma.entry.update({
      where: { id: parseInt(entryIdString) },
      data: {
        title,
        tagsText,
        body,
        code,
        dateUpdated: new Date()
      }
    })

    //log history record
    const entryHistory = await prisma.entryHistory.create({
      data: {
        title,
        tagsText,
        body,
        code,
        Entry: {
          connect: {
            id: entryResponse.id
          }
        }
      }
    })

    const log = await prisma.log.create({
      data: {
        User: {
          connect: {
            id: user.id
          }
        },
        Entry: {
          connect: {
            id: entryHistory.id
          }
        }
      }
    })

    res.status(201)
    res.json({ entryResponse, tagsResponse })
  } catch (err) {
    res.status(500)
    res.json({ error: err.message })
    console.error(err.message)
  } finally {
    await prisma.$disconnect()
  }
}

async function handleUpdateTags(prisma, entryId, tagsText) {
  const entry = await prisma.entry.findOne({
    where: {
      id: parseInt(entryId)
    },
    include: {
      Tags: true
    }
  })
  const currentTagsText = entry.tagsText
  const currentTagArray = currentTagsText.split(",")
  const updatedTagArray = tagsText.split(",")

  let deletedTags = []

  //delete tags that are not in the updated array
  entry.Tags.forEach(tag => {
    if (!updatedTagArray.includes(tag.name)) {
      prisma.tag
        .delete({
          where: {
            id: tag.id
          }
        })
        .then(res => {
          deletedTags.push(res)
        })
    }
  })

  let newTags = []

  //add tags that are not in the current array
  updatedTagArray.forEach(tag => {
    if (!currentTagArray.includes(tag) && tag.length > 0) {
      prisma.tag
        .create({
          data: {
            Entry: {
              connect: {
                id: entry.id
              }
            },
            name: tag
          }
        })
        .then(res => {
          newTags.push(res)
        })
    }
  })

  return { deletedTags, newTags }
}
