-- CreateTable
CREATE TABLE "Coordinates" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Coordinates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coordinates_id_key" ON "Coordinates"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Coordinates_userId_key" ON "Coordinates"("userId");

-- AddForeignKey
ALTER TABLE "Coordinates" ADD CONSTRAINT "Coordinates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
