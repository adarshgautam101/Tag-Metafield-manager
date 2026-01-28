/*
  Warnings:

  - You are about to drop the `ActiveSubscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BasicPlanLimits` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FreePlanLimits` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubscriptionHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ActiveSubscription";

-- DropTable
DROP TABLE "BasicPlanLimits";

-- DropTable
DROP TABLE "FreePlanLimits";

-- DropTable
DROP TABLE "SubscriptionHistory";

-- DropEnum
DROP TYPE "Plan";

-- DropEnum
DROP TYPE "SubscriptionStatus";
