/*
  Warnings:

  - You are about to drop the column `currentPeriodEnd` on the `ActiveSubscription` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ActiveSubscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopDomain" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ActiveSubscription" ("id", "plan", "shopDomain", "subscriptionId", "updatedAt") SELECT "id", "plan", "shopDomain", "subscriptionId", "updatedAt" FROM "ActiveSubscription";
DROP TABLE "ActiveSubscription";
ALTER TABLE "new_ActiveSubscription" RENAME TO "ActiveSubscription";
CREATE UNIQUE INDEX "ActiveSubscription_shopDomain_key" ON "ActiveSubscription"("shopDomain");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
