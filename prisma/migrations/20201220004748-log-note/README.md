# Migration `20201220004748-log-note`

This migration has been generated at 12/19/2020, 7:47:48 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Log" ADD COLUMN "note" text   NOT NULL DEFAULT E''
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201217192431-entry-reference-on-logs..20201220004748-log-note
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
@@ -64,8 +64,9 @@
   createdAt    DateTime      @default(now())
   userId       Int?
   historyId    Int?
   entryId      Int?
+  note         String        @default("")
   User         User?         @relation(fields: [userId], references: [id])
   EntryHistory EntryHistory? @relation(fields: [historyId], references: [id])
   Entry        Entry?        @relation(fields: [entryId], references: [id])
 }
```


