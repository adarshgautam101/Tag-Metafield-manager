/*
  Warnings:

  - You are about to drop the `ActiveSubscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BasicPlanLimits` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FreePlanLimits` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubscriptionHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ActiveSubscription";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BasicPlanLimits";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FreePlanLimits";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SubscriptionHistory";
PRAGMA foreign_keys=on;
