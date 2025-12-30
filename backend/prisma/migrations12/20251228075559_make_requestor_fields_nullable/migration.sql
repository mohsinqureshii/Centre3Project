-- DropForeignKey
ALTER TABLE "AccessRequest" DROP CONSTRAINT "AccessRequest_locationId_fkey";

-- AlterTable
ALTER TABLE "AccessRequest" ALTER COLUMN "requestType" DROP NOT NULL,
ALTER COLUMN "requestorName" DROP NOT NULL,
ALTER COLUMN "requestorEmail" DROP NOT NULL,
ALTER COLUMN "requestorPhone" DROP NOT NULL,
ALTER COLUMN "requestorCompany" DROP NOT NULL,
ALTER COLUMN "locationId" DROP NOT NULL,
ALTER COLUMN "startAt" DROP NOT NULL,
ALTER COLUMN "endAt" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "AccessRequest" ADD CONSTRAINT "AccessRequest_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
