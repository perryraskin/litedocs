import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

export default async function(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient({ log: ["query"] })

  try {
    const { entry } = req.body
    const { title, tagsText, body, code } = entry
    const newEntry = await prisma.entry.create({
      data: {
        title,
        tagsText,
        body,
        code,
        dateUpdated: new Date()
      }
    })

    const newTags = await handleAddTags(prisma, newEntry, tagsText)

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
