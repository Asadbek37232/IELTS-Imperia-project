-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'STUDENT');

-- CreateEnum
CREATE TYPE "SectionSubject" AS ENUM ('VOCABULARY', 'GRAMMAR');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestSession" (
    "id" TEXT NOT NULL,
    "pinCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "maxAttempts" INTEGER NOT NULL DEFAULT 1,
    "createdBy" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestSection" (
    "id" TEXT NOT NULL,
    "testSessionId" TEXT NOT NULL,
    "subject" "SectionSubject" NOT NULL,
    "variantGroups" TEXT NOT NULL,
    "numberOfExercises" INTEGER NOT NULL,
    "timeAllocated" INTEGER NOT NULL,
    "sectionOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "testSessionId" TEXT NOT NULL,
    "attemptNumber" INTEGER NOT NULL DEFAULT 1,
    "totalScore" DOUBLE PRECISION NOT NULL,
    "vocabScore" DOUBLE PRECISION,
    "grammarScore" DOUBLE PRECISION,
    "vocabCorrect" INTEGER,
    "vocabTotal" INTEGER,
    "grammarCorrect" INTEGER,
    "grammarTotal" INTEGER,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isCompleted" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentAnswer" (
    "id" TEXT NOT NULL,
    "resultId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "questionType" "SectionSubject" NOT NULL,
    "exerciseId" TEXT,
    "questionText" TEXT NOT NULL,
    "selectedAnswer" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActiveSession" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "testSessionId" TEXT NOT NULL,
    "pinCode" TEXT NOT NULL,
    "currentSubject" "SectionSubject" NOT NULL,
    "sectionOrder" INTEGER NOT NULL DEFAULT 1,
    "sectionDeadline" TIMESTAMP(3) NOT NULL,
    "selectedExercises" TEXT NOT NULL DEFAULT '{}',
    "answers" TEXT NOT NULL DEFAULT '[]',
    "tabSwitchCount" INTEGER NOT NULL DEFAULT 0,
    "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActiveSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "TestSession_pinCode_key" ON "TestSession"("pinCode");

-- CreateIndex
CREATE INDEX "TestSession_pinCode_idx" ON "TestSession"("pinCode");

-- CreateIndex
CREATE INDEX "TestSession_isActive_idx" ON "TestSession"("isActive");

-- CreateIndex
CREATE INDEX "TestSection_testSessionId_idx" ON "TestSection"("testSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "TestSection_testSessionId_sectionOrder_key" ON "TestSection"("testSessionId", "sectionOrder");

-- CreateIndex
CREATE INDEX "Result_studentId_idx" ON "Result"("studentId");

-- CreateIndex
CREATE INDEX "Result_testSessionId_idx" ON "Result"("testSessionId");

-- CreateIndex
CREATE INDEX "Result_studentId_testSessionId_idx" ON "Result"("studentId", "testSessionId");

-- CreateIndex
CREATE INDEX "StudentAnswer_resultId_idx" ON "StudentAnswer"("resultId");

-- CreateIndex
CREATE INDEX "ActiveSession_studentId_idx" ON "ActiveSession"("studentId");

-- CreateIndex
CREATE INDEX "ActiveSession_testSessionId_idx" ON "ActiveSession"("testSessionId");

-- CreateIndex
CREATE INDEX "ActiveSession_pinCode_idx" ON "ActiveSession"("pinCode");

-- AddForeignKey
ALTER TABLE "TestSession" ADD CONSTRAINT "TestSession_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestSection" ADD CONSTRAINT "TestSection_testSessionId_fkey" FOREIGN KEY ("testSessionId") REFERENCES "TestSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_testSessionId_fkey" FOREIGN KEY ("testSessionId") REFERENCES "TestSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAnswer" ADD CONSTRAINT "StudentAnswer_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveSession" ADD CONSTRAINT "ActiveSession_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveSession" ADD CONSTRAINT "ActiveSession_testSessionId_fkey" FOREIGN KEY ("testSessionId") REFERENCES "TestSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
