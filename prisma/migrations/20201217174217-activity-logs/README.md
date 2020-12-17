# Migration `20201217174217-activity-logs`

This migration has been generated at 12/17/2020, 12:42:17 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."User" ADD COLUMN "imageUrl" text   NOT NULL DEFAULT E''

CREATE TABLE "public"."EntryHistory" (
"id" SERIAL,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"entryId" integer   ,
"title" text   NOT NULL ,
"tagsText" text   NOT NULL ,
"body" text   NOT NULL ,
"code" text   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Log" (
"id" SERIAL,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"userId" integer   ,
"historyId" integer   ,
PRIMARY KEY ("id")
)

ALTER TABLE "public"."EntryHistory" ADD FOREIGN KEY("entryId")REFERENCES "public"."Entry"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Log" ADD FOREIGN KEY("userId")REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Log" ADD FOREIGN KEY("historyId")REFERENCES "public"."EntryHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201105171644-teams..20201217174217-activity-logs
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -15,25 +15,28 @@
   createdAt   DateTime @default(now())
   name        String
   email       String
   issuer      String   @unique
+  imageUrl    String   @default("")
   Entries     Entry[]
   Memberships Member[]
+  Log         Log[]
 }
 model Entry {
-  id          Int      @id @default(autoincrement())
-  createdAt   DateTime @default(now())
-  userId      Int?
-  teamId      Int?
-  title       String
-  tagsText    String
-  body        String
-  code        String
-  Tags        Tag[]
-  Author      User?    @relation(fields: [userId], references: [id])
-  Team        Team?    @relation(fields: [teamId], references: [id])
-  dateUpdated DateTime @default(now())
+  id           Int            @id @default(autoincrement())
+  createdAt    DateTime       @default(now())
+  userId       Int?
+  teamId       Int?
+  title        String
+  tagsText     String
+  body         String
+  code         String
+  Tags         Tag[]
+  Author       User?          @relation(fields: [userId], references: [id])
+  Team         Team?          @relation(fields: [teamId], references: [id])
+  dateUpdated  DateTime       @default(now())
+  EntryHistory EntryHistory[]
 }
 model Tag {
   id        Int      @id @default(autoincrement())
@@ -42,8 +45,29 @@
   name      String
   Entry     Entry?   @relation(fields: [entryId], references: [id])
 }
+model EntryHistory {
+  id        Int      @id @default(autoincrement())
+  createdAt DateTime @default(now())
+  entryId   Int?
+  title     String
+  tagsText  String
+  body      String
+  code      String
+  Entry     Entry?   @relation(fields: [entryId], references: [id])
+  Log       Log[]
+}
+
+model Log {
+  id        Int           @id @default(autoincrement())
+  createdAt DateTime      @default(now())
+  userId    Int?
+  historyId Int?
+  User      User?         @relation(fields: [userId], references: [id])
+  Entry     EntryHistory? @relation(fields: [historyId], references: [id])
+}
+
 model Team {
   id        Int      @id @default(autoincrement())
   createdAt DateTime @default(now())
   name      String
```


