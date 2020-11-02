export interface User {
  id: number
  name: string
  email: string
}

export interface Entry {
  id: number
  createdAt: Date
  userId: number
  title: string
  tagsText: string
  body: string
  code: string
  dateUpdated: Date
  Tags: Array<Tag>
}

export interface Tag {
  entryId: number
  name: string
}
