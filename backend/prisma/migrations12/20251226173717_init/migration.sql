/*
  Warnings:

  - You are about to drop the column `createdAt` on the `AccessRequest` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `AccessRequest` table. All the data in the column will be lost.
  - You are about to drop the column `allowedZones` on the `Credential` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AccessRequest" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Credential" DROP COLUMN "allowedZones";

-- CreateTable
CREATE TABLE "_CredentialZones" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CredentialZones_AB_unique" ON "_CredentialZones"("A", "B");

-- CreateIndex
CREATE INDEX "_CredentialZones_B_index" ON "_CredentialZones"("B");

-- AddForeignKey
ALTER TABLE "_CredentialZones" ADD CONSTRAINT "_CredentialZones_A_fkey" FOREIGN KEY ("A") REFERENCES "Credential"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CredentialZones" ADD CONSTRAINT "_CredentialZones_B_fkey" FOREIGN KEY ("B") REFERENCES "Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;
