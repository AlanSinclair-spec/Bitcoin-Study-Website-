-- CreateTable
CREATE TABLE "ChapterProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL DEFAULT 'anonymous',
    "chapterId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "progress" REAL NOT NULL DEFAULT 0,
    "lastVisited" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL DEFAULT 'anonymous',
    "chapterId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "score" REAL NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "answers" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "FlashcardReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL DEFAULT 'anonymous',
    "cardId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL DEFAULT 0,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "easeFactor" REAL NOT NULL DEFAULT 2.5,
    "nextReview" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL DEFAULT 'anonymous',
    "darkMode" BOOLEAN NOT NULL DEFAULT false,
    "cardsPerSession" INTEGER NOT NULL DEFAULT 20,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "ChapterProgress_userId_idx" ON "ChapterProgress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ChapterProgress_userId_chapterId_key" ON "ChapterProgress"("userId", "chapterId");

-- CreateIndex
CREATE INDEX "QuizAttempt_userId_chapterId_idx" ON "QuizAttempt"("userId", "chapterId");

-- CreateIndex
CREATE INDEX "FlashcardReview_userId_nextReview_idx" ON "FlashcardReview"("userId", "nextReview");

-- CreateIndex
CREATE UNIQUE INDEX "FlashcardReview_userId_cardId_key" ON "FlashcardReview"("userId", "cardId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");
