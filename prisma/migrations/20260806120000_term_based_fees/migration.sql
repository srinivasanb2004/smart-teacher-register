-- The fee structure has changed from a fixed system-generated monthly
-- amount to teacher-entered term amounts (Term 1 / Term 2 / Term 3).
-- Existing auto-generated monthly placeholder fee rows are cleared out
-- since they no longer match the new term-based structure.
TRUNCATE TABLE "public"."Fee";

-- DropIndex
DROP INDEX "public"."Fee_studentId_month_key";

-- AlterTable
ALTER TABLE "public"."Fee" RENAME COLUMN "month" TO "term";

-- CreateIndex
CREATE UNIQUE INDEX "Fee_studentId_term_key" ON "public"."Fee"("studentId", "term");
