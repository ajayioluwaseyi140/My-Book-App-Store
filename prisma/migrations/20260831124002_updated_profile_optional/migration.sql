-- DropIndex
DROP INDEX "profiles_bio_key";

-- AlterTable
ALTER TABLE "profiles" ALTER COLUMN "bio" DROP NOT NULL,
ALTER COLUMN "phoneNumber" DROP NOT NULL;
