# Migration `20201221000054-log-team-reference`

This migration has been generated at 12/20/2020, 7:00:54 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "Log" ADD COLUMN     "teamId" INTEGER

ALTER TABLE "Log" ADD FOREIGN KEY("teamId")REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201220004748-log-note..20201221000054-log-team-reference
--- datamodel.dml
+++ datamodel.dml
@@ -1,43 +1,40 @@
-// This is your Prisma schema file,
-// learn more about it in the docs: https://pris.ly/d/prisma-schema
+generator client {
+  provider = "prisma-client-js"
+}
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
-generator client {
-  provider = "prisma-client-js"
-}
-
 model User {
   id          Int      @id @default(autoincrement())
   createdAt   DateTime @default(now())
   name        String
   email       String
   issuer      String   @unique
   imageUrl    String   @default("")
   Entries     Entry[]
+  Log         Log[]
   Memberships Member[]
-  Log         Log[]
 }
 model Entry {
   id          Int            @id @default(autoincrement())
   createdAt   DateTime       @default(now())
   userId      Int?
-  teamId      Int?
   title       String
   tagsText    String
   body        String
   code        String
-  Tags        Tag[]
+  dateUpdated DateTime       @default(now())
+  teamId      Int?
+  Team        Team?          @relation(fields: [teamId], references: [id])
   Author      User?          @relation(fields: [userId], references: [id])
-  Team        Team?          @relation(fields: [teamId], references: [id])
-  dateUpdated DateTime       @default(now())
   History     EntryHistory[]
   Logs        Log[]
+  Tags        Tag[]
 }
 model Tag {
   id        Int      @id @default(autoincrement())
@@ -62,24 +59,27 @@
 model Log {
   id           Int           @id @default(autoincrement())
   createdAt    DateTime      @default(now())
   userId       Int?
+  teamId       Int?
   historyId    Int?
   entryId      Int?
   note         String        @default("")
+  Entry        Entry?        @relation(fields: [entryId], references: [id])
+  EntryHistory EntryHistory? @relation(fields: [historyId], references: [id])
   User         User?         @relation(fields: [userId], references: [id])
-  EntryHistory EntryHistory? @relation(fields: [historyId], references: [id])
-  Entry        Entry?        @relation(fields: [entryId], references: [id])
+  Team         Team?         @relation(fields: [teamId], references: [id])
 }
 model Team {
   id        Int      @id @default(autoincrement())
   createdAt DateTime @default(now())
   name      String
   handle    String   @unique
   imageUrl  String
+  Entries   Entry[]
   Members   Member[]
-  Entries   Entry[]
+  Logs       Log[]
 }
 model Member {
   id         Int      @id @default(autoincrement())
```


