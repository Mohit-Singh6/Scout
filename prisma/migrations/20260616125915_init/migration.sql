-- CreateEnum
CREATE TYPE "RouteType" AS ENUM ('FRONTEND_PAGE', 'BACKEND_HEALTH');

-- CreateEnum
CREATE TYPE "CurrentCondition" AS ENUM ('OPERATIONAL', 'DEGRADED', 'DOWN', 'TIMEOUT');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerType" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refreshToken" TEXT,
    "accessToken" TEXT,
    "accessTokenExpires" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationRequest" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Website" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "hostingProvider" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Website_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonitoredRoute" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "routePath" TEXT NOT NULL,
    "routeType" "RouteType" NOT NULL,
    "currentCondition" "CurrentCondition" NOT NULL DEFAULT 'OPERATIONAL',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonitoredRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LatencyLog" (
    "id" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "latencyMs" INTEGER NOT NULL,
    "exceptionMessage" TEXT,
    "aiSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LatencyLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_providerId_providerAccountId_key" ON "Account"("providerId", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Session_accessToken_key" ON "Session"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationRequest_token_key" ON "VerificationRequest"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationRequest_identifier_token_key" ON "VerificationRequest"("identifier", "token");

-- CreateIndex
CREATE INDEX "LatencyLog_routeId_createdAt_idx" ON "LatencyLog"("routeId", "createdAt");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Website" ADD CONSTRAINT "Website_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonitoredRoute" ADD CONSTRAINT "MonitoredRoute_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LatencyLog" ADD CONSTRAINT "LatencyLog_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "MonitoredRoute"("id") ON DELETE CASCADE ON UPDATE CASCADE;
