export interface User {
  id: number
  name: string
  email: string
  Entries: Array<Entry>
  Memberships: Array<Member>
}

export interface Entry {
  id: number
  createdAt: Date
  userId: number
  teamId: number
  title: string
  tagsText: string
  body: string
  code: string
  dateUpdated: Date
  Tags: Array<Tag>
  Author: User
  Team: Team
}

export interface Tag {
  entryId: number
  name: string
}

export interface Team {
  id: number
  name: string
  handle: string
  imageUrl: string
  Members: Array<Member>
  Entries: Array<Entry>
}

export interface Member {
  id: number
  createdAt: Date
  teamId: number
  userId: number
  memberType: MemberType
  Team: Team
  User: User
}

export enum MemberType {
  Owner = 1,
  Member
}
