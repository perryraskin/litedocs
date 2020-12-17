# Migration `20201217192431-entry-reference-on-logs`

This migration has been generated at 12/17/2020, 2:24:31 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Log" ADD COLUMN "entryId" integer   

ALTER TABLE "public"."Log" ADD FOREIGN KEY("entryId")REFERENCES "public"."Entry"("id") ON DELETE SET NULL ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201217174217-activity-logs..20201217192431-entry-reference-on-logs
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
@@ -22,21 +22,22 @@
   Log         Log[]
 }
 model Entry {
-  id           Int            @id @default(autoincrement())
-  createdAt    DateTime       @default(now())
-  userId       Int?
-  teamId       Int?
-  title        String
-  tagsText     String
-  body         String
-  code         String
-  Tags         Tag[]
-  Author       User?          @relation(fields: [userId], references: [id])
-  Team         Team?          @relation(fields: [teamId], references: [id])
-  dateUpdated  DateTime       @default(now())
-  EntryHistory EntryHistory[]
+  id          Int            @id @default(autoincrement())
+  createdAt   DateTime       @default(now())
+  userId      Int?
+  teamId      Int?
+  title       String
+  tagsText    String
+  body        String
+  code        String
+  Tags        Tag[]
+  Author      User?          @relation(fields: [userId], references: [id])
+  Team        Team?          @relation(fields: [teamId], references: [id])
+  dateUpdated DateTime       @default(now())
+  History     EntryHistory[]
+  Logs        Log[]
 }
 model Tag {
   id        Int      @id @default(autoincrement())
@@ -58,14 +59,16 @@
   Log       Log[]
 }
 model Log {
-  id        Int           @id @default(autoincrement())
-  createdAt DateTime      @default(now())
-  userId    Int?
-  historyId Int?
-  User      User?         @relation(fields: [userId], references: [id])
-  Entry     EntryHistory? @relation(fields: [historyId], references: [id])
+  id           Int           @id @default(autoincrement())
+  createdAt    DateTime      @default(now())
+  userId       Int?
+  historyId    Int?
+  entryId      Int?
+  User         User?         @relation(fields: [userId], references: [id])
+  EntryHistory EntryHistory? @relation(fields: [historyId], references: [id])
+  Entry        Entry?        @relation(fields: [entryId], references: [id])
 }
 model Team {
   id        Int      @id @default(autoincrement())
```


