-- AlterTable: multiple product images as JSON array text; migrate legacy imageUrl.
ALTER TABLE "Product" ADD COLUMN "images" TEXT NOT NULL DEFAULT '[]';

UPDATE "Product"
SET "images" = CASE
  WHEN "imageUrl" IS NOT NULL AND TRIM("imageUrl") <> ''
  THEN json_build_array(TRIM("imageUrl"))::text
  ELSE '[]'
END;

ALTER TABLE "Product" DROP COLUMN "imageUrl";
