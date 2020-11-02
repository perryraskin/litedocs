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
    const { entry } = req.body
    const { title, tagsText, body, code } = entry
    console.log(req.body)

    const tagsResponse = await handleUpdateTags(prisma, entryIdInt, tagsText)

    const entryResponse = await prisma.entry.update({
      where: { id: parseInt(entryIdInt) },
      data: {
        title,
        tagsText,
        body,
        code,
        dateUpdated: new Date()
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
