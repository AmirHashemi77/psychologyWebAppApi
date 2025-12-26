-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Tag" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "_ArticleToTag" ADD CONSTRAINT "_ArticleToTag_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ArticleToTag_AB_unique";
