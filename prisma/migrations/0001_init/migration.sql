-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT,
    "phone" TEXT,
    "avatar" TEXT,
    "role" TEXT NOT NULL DEFAULT 'FARMER',
    "emailVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Farm" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cphNumber" TEXT,
    "sbiNumber" TEXT,
    "county" TEXT,
    "postcode" TEXT,
    "totalHectares" DOUBLE PRECISION,
    "farmType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Farm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FarmMembership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'owner',

    CONSTRAINT "FarmMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Field" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fieldNumber" TEXT,
    "hectares" DOUBLE PRECISION NOT NULL,
    "cropType" TEXT,
    "soilType" TEXT,
    "nvzZone" BOOLEAN NOT NULL DEFAULT false,
    "geometry" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldSeason" (
    "id" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "crop" TEXT NOT NULL,
    "variety" TEXT,
    "plantingDate" TIMESTAMP(3),
    "harvestDate" TIMESTAMP(3),
    "yieldTonnes" DOUBLE PRECISION,

    CONSTRAINT "FieldSeason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoilTest" (
    "id" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "ph" DOUBLE PRECISION,
    "pIndex" INTEGER,
    "kIndex" INTEGER,
    "mgIndex" INTEGER,
    "organicMatter" DOUBLE PRECISION,

    CONSTRAINT "SoilTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SprayRecord" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "operatorId" TEXT NOT NULL,
    "equipmentId" TEXT,
    "weatherSnapshotId" TEXT,
    "startTime" TEXT,
    "endTime" TEXT,
    "areaTreatedHa" DOUBLE PRECISION,
    "reason" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SprayRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SprayProduct" (
    "id" TEXT NOT NULL,
    "sprayRecordId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "activeIngredient" TEXT,
    "doseRate" DOUBLE PRECISION,
    "doseUnit" TEXT,
    "areaTreated" DOUBLE PRECISION,
    "batchNumber" TEXT,
    "mapp" TEXT,

    CONSTRAINT "SprayProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SprayWeather" (
    "id" TEXT NOT NULL,
    "tempC" DOUBLE PRECISION,
    "windSpeedKmh" DOUBLE PRECISION,
    "windDirection" TEXT,
    "humidityPct" DOUBLE PRECISION,
    "rainLast24hMm" DOUBLE PRECISION,
    "source" TEXT,

    CONSTRAINT "SprayWeather_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PppProduct" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mapp" TEXT,
    "activeIngredient" TEXT,
    "formulation" TEXT,
    "manufacturer" TEXT,
    "crops" TEXT,
    "maxDoseRate" DOUBLE PRECISION,
    "doseUnit" TEXT,
    "harvestInterval" INTEGER,
    "bufferZone" INTEGER,
    "aquaticSafe" BOOLEAN NOT NULL DEFAULT false,
    "approvalExpiry" TIMESTAMP(3),

    CONSTRAINT "PppProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "nozzleType" TEXT,
    "tankCapacity" DOUBLE PRECISION,
    "calibrationDate" TIMESTAMP(3),
    "motExpiry" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnimalGroup" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "species" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnimalGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Animal" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "earTag" TEXT NOT NULL,
    "eidNumber" TEXT,
    "species" TEXT NOT NULL,
    "breed" TEXT,
    "sex" TEXT,
    "dob" TIMESTAMP(3),
    "damId" TEXT,
    "sireId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'alive',
    "groupId" TEXT,
    "passportNumber" TEXT,
    "purchaseDate" TIMESTAMP(3),
    "purchaseFrom" TEXT,
    "purchasePrice" DOUBLE PRECISION,
    "notes" TEXT,
    "deathDate" TIMESTAMP(3),
    "soldDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Animal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnimalMedicine" (
    "id" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "medicineRecordId" TEXT NOT NULL,

    CONSTRAINT "AnimalMedicine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovementAnimal" (
    "id" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "movementId" TEXT NOT NULL,

    CONSTRAINT "MovementAnimal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movement" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "fromCph" TEXT NOT NULL,
    "toCph" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "haulier" TEXT,
    "vehicleReg" TEXT,
    "movementType" TEXT NOT NULL,
    "animalCount" INTEGER NOT NULL DEFAULT 1,
    "species" TEXT,
    "bcmsSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "bcmsRef" TEXT,
    "departureTime" TEXT,
    "journeyDuration" DOUBLE PRECISION,
    "standstillEnd" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Movement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BreedingRecord" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "damId" TEXT NOT NULL,
    "sireId" TEXT,
    "sireName" TEXT,
    "serviceDate" TIMESTAMP(3),
    "method" TEXT,
    "expectedCalving" TIMESTAMP(3),
    "calvingDate" TIMESTAMP(3),
    "calfId" TEXT,
    "calfSex" TEXT,
    "calfBreed" TEXT,
    "calfWeight" DOUBLE PRECISION,
    "assisted" BOOLEAN NOT NULL DEFAULT false,
    "presentation" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BreedingRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicineRecord" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "productName" TEXT NOT NULL,
    "batchNumber" TEXT,
    "dose" TEXT,
    "doseNumeric" DOUBLE PRECISION,
    "doseUnit" TEXT,
    "route" TEXT,
    "withdrawalMeatDays" INTEGER,
    "withdrawalMilkDays" INTEGER,
    "withdrawalEndMeat" TIMESTAMP(3),
    "withdrawalEndMilk" TIMESTAMP(3),
    "withdrawalEndDate" TIMESTAMP(3),
    "vetId" TEXT,
    "vetName" TEXT,
    "reason" TEXT,
    "notes" TEXT,
    "animalWeight" DOUBLE PRECISION,
    "expiryDate" TEXT,
    "isCourse" BOOLEAN NOT NULL DEFAULT false,
    "courseDoses" INTEGER,
    "courseIntervalHours" INTEGER,
    "courseCurrentDose" INTEGER DEFAULT 1,
    "productId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MedicineRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VetContact" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "practice" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "rcvsNumber" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VetContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VetMedicine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "activeIngredient" TEXT,
    "species" TEXT,
    "defaultDose" TEXT,
    "route" TEXT,
    "withdrawalMeatDays" INTEGER,
    "withdrawalMilkDays" INTEGER,
    "pomStatus" TEXT,
    "manufacturer" TEXT,

    CONSTRAINT "VetMedicine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FertiliserRecord" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "productType" TEXT NOT NULL,
    "productName" TEXT,
    "rateKgHa" DOUBLE PRECISION,
    "rateUnit" TEXT,
    "nContent" DOUBLE PRECISION,
    "pContent" DOUBLE PRECISION,
    "kContent" DOUBLE PRECISION,
    "nPercent" DOUBLE PRECISION,
    "pPercent" DOUBLE PRECISION,
    "kPercent" DOUBLE PRECISION,
    "method" TEXT,
    "operatorId" TEXT,
    "equipmentId" TEXT,
    "areaTreatedHa" DOUBLE PRECISION,
    "soilCondition" TEXT,
    "distanceFromWater" DOUBLE PRECISION,
    "notes" TEXT,
    "nvzCompliant" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FertiliserRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutrientPlan" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "plannedN" DOUBLE PRECISION,
    "plannedP" DOUBLE PRECISION,
    "plannedK" DOUBLE PRECISION,
    "actualN" DOUBLE PRECISION,
    "actualP" DOUBLE PRECISION,
    "actualK" DOUBLE PRECISION,
    "nvzCompliant" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "NutrientPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SfiAgreement" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "sfiRef" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "totalAnnualPayment" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "SfiAgreement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SfiAction" (
    "id" TEXT NOT NULL,
    "agreementId" TEXT NOT NULL,
    "actionCode" TEXT NOT NULL,
    "actionName" TEXT NOT NULL,
    "fieldId" TEXT,
    "hectares" DOUBLE PRECISION,
    "paymentPerHa" DOUBLE PRECISION,
    "evidenceRequired" TEXT,

    CONSTRAINT "SfiAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SfiEvidence" (
    "id" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "photoUrl" TEXT,
    "geoLat" DOUBLE PRECISION,
    "geoLng" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'draft',

    CONSTRAINT "SfiEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditChecklist" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "scheme" TEXT NOT NULL,
    "auditDate" TIMESTAMP(3),
    "auditor" TEXT,
    "status" TEXT NOT NULL DEFAULT 'prep',

    CONSTRAINT "AuditChecklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditItem" (
    "id" TEXT NOT NULL,
    "checklistId" TEXT NOT NULL,
    "requirement" TEXT NOT NULL,
    "category" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "evidenceUrl" TEXT,
    "notes" TEXT,

    CONSTRAINT "AuditItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplianceAlert" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComplianceAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeatherStation" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "stationRef" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,

    CONSTRAINT "WeatherStation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeatherReading" (
    "id" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "tempC" DOUBLE PRECISION,
    "humidity" DOUBLE PRECISION,
    "windSpeed" DOUBLE PRECISION,
    "windDirection" TEXT,
    "rainfallMm" DOUBLE PRECISION,
    "pressureHpa" DOUBLE PRECISION,

    CONSTRAINT "WeatherReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "actionUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmsAlert" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "SmsAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "farmId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT,
    "entityId" TEXT,
    "details" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactSubmission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "farmName" TEXT,
    "message" TEXT NOT NULL,
    "source" TEXT,
    "medium" TEXT,
    "campaign" TEXT,
    "device" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "FarmMembership_userId_farmId_key" ON "FarmMembership"("userId", "farmId");

-- CreateIndex
CREATE UNIQUE INDEX "SprayRecord_weatherSnapshotId_key" ON "SprayRecord"("weatherSnapshotId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimalMedicine_animalId_medicineRecordId_key" ON "AnimalMedicine"("animalId", "medicineRecordId");

-- CreateIndex
CREATE UNIQUE INDEX "MovementAnimal_animalId_movementId_key" ON "MovementAnimal"("animalId", "movementId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FarmMembership" ADD CONSTRAINT "FarmMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FarmMembership" ADD CONSTRAINT "FarmMembership_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Field" ADD CONSTRAINT "Field_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldSeason" ADD CONSTRAINT "FieldSeason_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoilTest" ADD CONSTRAINT "SoilTest_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SprayRecord" ADD CONSTRAINT "SprayRecord_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SprayRecord" ADD CONSTRAINT "SprayRecord_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SprayRecord" ADD CONSTRAINT "SprayRecord_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SprayRecord" ADD CONSTRAINT "SprayRecord_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SprayRecord" ADD CONSTRAINT "SprayRecord_weatherSnapshotId_fkey" FOREIGN KEY ("weatherSnapshotId") REFERENCES "SprayWeather"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SprayProduct" ADD CONSTRAINT "SprayProduct_sprayRecordId_fkey" FOREIGN KEY ("sprayRecordId") REFERENCES "SprayRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimalGroup" ADD CONSTRAINT "AnimalGroup_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "AnimalGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimalMedicine" ADD CONSTRAINT "AnimalMedicine_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimalMedicine" ADD CONSTRAINT "AnimalMedicine_medicineRecordId_fkey" FOREIGN KEY ("medicineRecordId") REFERENCES "MedicineRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovementAnimal" ADD CONSTRAINT "MovementAnimal_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovementAnimal" ADD CONSTRAINT "MovementAnimal_movementId_fkey" FOREIGN KEY ("movementId") REFERENCES "Movement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movement" ADD CONSTRAINT "Movement_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BreedingRecord" ADD CONSTRAINT "BreedingRecord_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BreedingRecord" ADD CONSTRAINT "BreedingRecord_damId_fkey" FOREIGN KEY ("damId") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BreedingRecord" ADD CONSTRAINT "BreedingRecord_sireId_fkey" FOREIGN KEY ("sireId") REFERENCES "Animal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BreedingRecord" ADD CONSTRAINT "BreedingRecord_calfId_fkey" FOREIGN KEY ("calfId") REFERENCES "Animal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineRecord" ADD CONSTRAINT "MedicineRecord_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineRecord" ADD CONSTRAINT "MedicineRecord_vetId_fkey" FOREIGN KEY ("vetId") REFERENCES "VetContact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VetContact" ADD CONSTRAINT "VetContact_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FertiliserRecord" ADD CONSTRAINT "FertiliserRecord_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FertiliserRecord" ADD CONSTRAINT "FertiliserRecord_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FertiliserRecord" ADD CONSTRAINT "FertiliserRecord_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FertiliserRecord" ADD CONSTRAINT "FertiliserRecord_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutrientPlan" ADD CONSTRAINT "NutrientPlan_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutrientPlan" ADD CONSTRAINT "NutrientPlan_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SfiAgreement" ADD CONSTRAINT "SfiAgreement_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SfiAction" ADD CONSTRAINT "SfiAction_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "SfiAgreement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SfiAction" ADD CONSTRAINT "SfiAction_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SfiEvidence" ADD CONSTRAINT "SfiEvidence_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "SfiAction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditChecklist" ADD CONSTRAINT "AuditChecklist_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditItem" ADD CONSTRAINT "AuditItem_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "AuditChecklist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplianceAlert" ADD CONSTRAINT "ComplianceAlert_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeatherStation" ADD CONSTRAINT "WeatherStation_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeatherReading" ADD CONSTRAINT "WeatherReading_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "WeatherStation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmsAlert" ADD CONSTRAINT "SmsAlert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

