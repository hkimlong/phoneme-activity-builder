-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('PAGE_VIEW', 'ACTIVITY_USED', 'GENERATION', 'SIMULATED_INPUT');

-- CreateTable
CREATE TABLE "UsageEvent" (
    "id" TEXT NOT NULL,
    "eventType" "EventType" NOT NULL,
    "activityType" "ActivityType",
    "page" TEXT,
    "duration" INTEGER,
    "success" BOOLEAN,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageEvent_pkey" PRIMARY KEY ("id")
);
