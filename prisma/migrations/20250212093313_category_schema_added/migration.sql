/*
  Warnings:

  - You are about to drop the column `category` on the `Product` table. All the data in the column will be lost.
  - Added the required column `cateName` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "category",
ADD COLUMN     "cateName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Category" (
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_cateName_fkey" FOREIGN KEY ("cateName") REFERENCES "Category"("name") ON DELETE CASCADE ON UPDATE CASCADE;
