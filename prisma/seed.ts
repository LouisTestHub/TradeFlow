import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.auditLog.deleteMany();
  await prisma.smsAlert.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.weatherReading.deleteMany();
  await prisma.weatherStation.deleteMany();
  await prisma.complianceAlert.deleteMany();
  await prisma.auditItem.deleteMany();
  await prisma.auditChecklist.deleteMany();
  await prisma.sfiEvidence.deleteMany();
  await prisma.sfiAction.deleteMany();
  await prisma.sfiAgreement.deleteMany();
  await prisma.nutrientPlan.deleteMany();
  await prisma.fertiliserRecord.deleteMany();
  await prisma.breedingRecord.deleteMany();
  await prisma.animalMedicine.deleteMany();
  await prisma.medicineRecord.deleteMany();
  await prisma.vetMedicine.deleteMany();
  await prisma.movementAnimal.deleteMany();
  await prisma.movement.deleteMany();
  await prisma.animal.deleteMany();
  await prisma.animalGroup.deleteMany();
  await prisma.sprayProduct.deleteMany();
  await prisma.sprayWeather.deleteMany();
  await prisma.sprayRecord.deleteMany();
  await prisma.pppProduct.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.soilTest.deleteMany();
  await prisma.fieldSeason.deleteMany();
  await prisma.field.deleteMany();
  await prisma.farmMembership.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.contactSubmission.deleteMany();
  await prisma.farm.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('demo1234', 12);

  // ==================== USERS ====================
  const james = await prisma.user.create({
    data: { email: 'james@oakfieldfarm.co.uk', name: 'James Thompson', passwordHash, phone: '07700900001', role: 'FARMER' },
  });
  const sarah = await prisma.user.create({
    data: { email: 'sarah@oakfieldfarm.co.uk', name: 'Sarah Mitchell', passwordHash, phone: '07700900002', role: 'FARM_MANAGER' },
  });
  const robert = await prisma.user.create({
    data: { email: 'robert@agri-advisory.co.uk', name: 'Robert Kennedy', passwordHash, phone: '07700900003', role: 'AGRONOMIST' },
  });
  const admin = await prisma.user.create({
    data: { email: 'admin@fieldkeeper.co.uk', name: 'Admin User', passwordHash, role: 'ADMIN' },
  });

  // ==================== FARM ====================
  const farm = await prisma.farm.create({
    data: {
      name: 'Oakfield Farm',
      cphNumber: '12/345/6789',
      sbiNumber: '123456789',
      county: 'Somerset',
      postcode: 'TA4 3EG',
      totalHectares: 150,
      farmType: 'mixed',
    },
  });

  // Farm memberships
  await prisma.farmMembership.createMany({
    data: [
      { userId: james.id, farmId: farm.id, role: 'owner' },
      { userId: sarah.id, farmId: farm.id, role: 'manager' },
      { userId: robert.id, farmId: farm.id, role: 'agronomist' },
    ],
  });

  // ==================== FIELDS ====================
  const fieldData = [
    { name: 'Top Meadow', fieldNumber: 'TM01', hectares: 24.5, cropType: 'Winter Wheat', soilType: 'Clay Loam', nvzZone: true },
    { name: 'Lower Barley', fieldNumber: 'LB02', hectares: 18.3, cropType: 'Spring Barley', soilType: 'Sandy Loam', nvzZone: false },
    { name: 'Home Paddock', fieldNumber: 'HP03', hectares: 8.7, cropType: 'Permanent Pasture', soilType: 'Clay', nvzZone: false },
    { name: 'Long Acre', fieldNumber: 'LA04', hectares: 32.1, cropType: 'Winter Oilseed Rape', soilType: 'Silt Loam', nvzZone: true },
    { name: 'Brook Field', fieldNumber: 'BF05', hectares: 15.6, cropType: 'Winter Wheat', soilType: 'Clay Loam', nvzZone: true },
    { name: 'Hill Ground', fieldNumber: 'HG06', hectares: 22.0, cropType: 'Permanent Pasture', soilType: 'Loam', nvzZone: false },
    { name: 'Oak Copse', fieldNumber: 'OC07', hectares: 12.4, cropType: 'Woodland / SFI', soilType: 'Sandy Clay', nvzZone: false },
    { name: 'River Meadow', fieldNumber: 'RM08', hectares: 16.4, cropType: 'Silage', soilType: 'Alluvial', nvzZone: true },
  ];

  const fields: any[] = [];
  for (const f of fieldData) {
    const field = await prisma.field.create({ data: { farmId: farm.id, ...f } });
    fields.push(field);
  }

  // Field seasons
  for (const field of fields) {
    await prisma.fieldSeason.create({
      data: {
        fieldId: field.id,
        year: 2025,
        crop: field.cropType || 'Unknown',
        variety: field.cropType === 'Winter Wheat' ? 'KWS Extase' : field.cropType === 'Spring Barley' ? 'Planet' : field.cropType === 'Winter Oilseed Rape' ? 'DK Exsteel' : null,
        plantingDate: new Date('2024-10-01'),
        harvestDate: field.cropType?.includes('Winter') ? new Date('2025-08-15') : field.cropType === 'Spring Barley' ? new Date('2025-08-20') : null,
        yieldTonnes: field.cropType === 'Winter Wheat' ? 8.5 : field.cropType === 'Spring Barley' ? 6.2 : field.cropType === 'Winter Oilseed Rape' ? 3.8 : null,
      },
    });
  }

  // Soil tests
  for (const field of fields.slice(0, 5)) {
    await prisma.soilTest.create({
      data: { fieldId: field.id, date: new Date('2024-11-15'), ph: 6.2 + Math.random(), pIndex: Math.floor(Math.random() * 4) + 1, kIndex: Math.floor(Math.random() * 4) + 1, mgIndex: Math.floor(Math.random() * 3) + 1, organicMatter: 3 + Math.random() * 3 },
    });
  }

  // ==================== EQUIPMENT ====================
  const sprayer = await prisma.equipment.create({
    data: { farmId: farm.id, name: 'Hardi Commander 4400', type: 'sprayer', nozzleType: 'Defy 3D 025', tankCapacity: 4400, calibrationDate: new Date('2025-01-15') },
  });
  await prisma.equipment.create({
    data: { farmId: farm.id, name: 'Amazone ZA-V 2200', type: 'spreader', calibrationDate: new Date('2025-02-01') },
  });
  await prisma.equipment.create({
    data: { farmId: farm.id, name: 'Väderstad Rapid 400C', type: 'drill', calibrationDate: new Date('2024-09-20') },
  });
  await prisma.equipment.create({
    data: { farmId: farm.id, name: 'Massey Ferguson 7726', type: 'other', notes: 'Main tractor', motExpiry: new Date('2025-12-01') },
  });

  // ==================== PPP PRODUCTS ====================
  const pppData = [
    { name: 'Atlantis Star', mapp: '20095', activeIngredient: 'Mesosulfuron-methyl + Thiencarbazone-methyl', formulation: 'OD', manufacturer: 'Bayer', crops: 'Winter Wheat', maxDoseRate: 1.0, doseUnit: 'l/ha', harvestInterval: 56, bufferZone: 5 },
    { name: 'Proline 275', mapp: '14646', activeIngredient: 'Prothioconazole', formulation: 'EC', manufacturer: 'Bayer', crops: 'Wheat, Barley, OSR', maxDoseRate: 0.72, doseUnit: 'l/ha', harvestInterval: 35, bufferZone: 5 },
    { name: 'Revystar XE', mapp: '19849', activeIngredient: 'Mefentrifluconazole + Fluxapyroxad', formulation: 'EC', manufacturer: 'BASF', crops: 'Wheat, Barley', maxDoseRate: 1.5, doseUnit: 'l/ha', harvestInterval: 35, bufferZone: 5 },
    { name: 'Roundup PowerMax', mapp: '16489', activeIngredient: 'Glyphosate', formulation: 'SL', manufacturer: 'Bayer', crops: 'All crops (pre-harvest/stubble)', maxDoseRate: 3.0, doseUnit: 'l/ha', harvestInterval: 7, bufferZone: 5 },
    { name: 'Pixxaro EC', mapp: '19028', activeIngredient: 'Halauxifen-methyl + Fluroxypyr', formulation: 'EC', manufacturer: 'Corteva', crops: 'Wheat, Barley', maxDoseRate: 0.5, doseUnit: 'l/ha', harvestInterval: 60, bufferZone: 5 },
    { name: 'Decoy Wetex', mapp: '10102', activeIngredient: 'Metaldehyde', formulation: 'Pellet', manufacturer: 'De Sangosse', crops: 'All crops', maxDoseRate: 7.0, doseUnit: 'kg/ha', harvestInterval: 0, bufferZone: 0 },
    { name: 'Hallmark Zeon', mapp: '12714', activeIngredient: 'Lambda-cyhalothrin', formulation: 'CS', manufacturer: 'Syngenta', crops: 'Wheat, Barley, OSR', maxDoseRate: 0.075, doseUnit: 'l/ha', harvestInterval: 28, bufferZone: 5, aquaticSafe: false },
    { name: 'Stomp Aqua', mapp: '15478', activeIngredient: 'Pendimethalin', formulation: 'CS', manufacturer: 'BASF', crops: 'Wheat, Barley, OSR', maxDoseRate: 2.9, doseUnit: 'l/ha', harvestInterval: 0, bufferZone: 5 },
    { name: 'Axial Pro', mapp: '20157', activeIngredient: 'Pinoxaden', formulation: 'EC', manufacturer: 'Syngenta', crops: 'Wheat, Barley', maxDoseRate: 0.9, doseUnit: 'l/ha', harvestInterval: 42, bufferZone: 5 },
    { name: 'Bravo 500', mapp: '13870', activeIngredient: 'Chlorothalonil', formulation: 'SC', manufacturer: 'Syngenta', crops: 'Wheat, Barley', maxDoseRate: 2.0, doseUnit: 'l/ha', harvestInterval: 42, bufferZone: 18 },
    { name: 'Kerb Flo 400', mapp: '14789', activeIngredient: 'Propyzamide', formulation: 'SC', manufacturer: 'Corteva', crops: 'OSR', maxDoseRate: 2.1, doseUnit: 'l/ha', harvestInterval: 0, bufferZone: 5 },
    { name: 'Astrokerb', mapp: '17920', activeIngredient: 'Propyzamide + Aminopyralid', formulation: 'SC', manufacturer: 'Corteva', crops: 'OSR', maxDoseRate: 2.5, doseUnit: 'l/ha', harvestInterval: 0, bufferZone: 5 },
    { name: 'Elatus Era', mapp: '19044', activeIngredient: 'Benzovindiflupyr + Prothioconazole', formulation: 'EC', manufacturer: 'Syngenta', crops: 'Wheat, Barley', maxDoseRate: 1.0, doseUnit: 'l/ha', harvestInterval: 35, bufferZone: 5 },
    { name: 'Galaxy', mapp: '15221', activeIngredient: 'Fluroxypyr + Clopyralid + MCPA', formulation: 'EC', manufacturer: 'Dow', crops: 'Grassland, Cereals', maxDoseRate: 2.0, doseUnit: 'l/ha', harvestInterval: 21, bufferZone: 5 },
    { name: 'Clinic UP', mapp: '15534', activeIngredient: 'Glyphosate', formulation: 'SL', manufacturer: 'Nufarm', crops: 'All crops (desiccation)', maxDoseRate: 4.0, doseUnit: 'l/ha', harvestInterval: 7, bufferZone: 5 },
    { name: 'Prosaro', mapp: '15601', activeIngredient: 'Prothioconazole + Tebuconazole', formulation: 'EC', manufacturer: 'Bayer', crops: 'Wheat, Barley, OSR', maxDoseRate: 1.0, doseUnit: 'l/ha', harvestInterval: 35, bufferZone: 5 },
    { name: 'Clomazone 360', mapp: '18012', activeIngredient: 'Clomazone', formulation: 'CS', manufacturer: 'Adama', crops: 'OSR', maxDoseRate: 0.25, doseUnit: 'l/ha', harvestInterval: 0, bufferZone: 20 },
    { name: 'Hammer', mapp: '14999', activeIngredient: 'Carfentrazone-ethyl', formulation: 'EC', manufacturer: 'FMC', crops: 'Wheat, Barley', maxDoseRate: 1.0, doseUnit: 'l/ha', harvestInterval: 42, bufferZone: 5 },
    { name: 'Amistar', mapp: '11278', activeIngredient: 'Azoxystrobin', formulation: 'SC', manufacturer: 'Syngenta', crops: 'Wheat, Barley, OSR', maxDoseRate: 1.0, doseUnit: 'l/ha', harvestInterval: 35, bufferZone: 5 },
    { name: 'Liberator', mapp: '16700', activeIngredient: 'Flufenacet + Diflufenican', formulation: 'SC', manufacturer: 'Bayer', crops: 'Wheat', maxDoseRate: 0.6, doseUnit: 'l/ha', harvestInterval: 0, bufferZone: 5 },
    // Additional products
    { name: 'Topik', mapp: '12500', activeIngredient: 'Clodinafop-propargyl', formulation: 'EC', manufacturer: 'Syngenta', crops: 'Wheat', maxDoseRate: 0.5, doseUnit: 'l/ha', harvestInterval: 42, bufferZone: 5 },
    { name: 'Othello', mapp: '17555', activeIngredient: 'Diflufenican + Iodosulfuron + Mesosulfuron', formulation: 'OD', manufacturer: 'Bayer', crops: 'Wheat', maxDoseRate: 1.5, doseUnit: 'l/ha', harvestInterval: 56, bufferZone: 5 },
    { name: 'Samson Extra 6 OD', mapp: '17800', activeIngredient: 'Nicosulfuron', formulation: 'OD', manufacturer: 'Belchim', crops: 'Maize', maxDoseRate: 0.75, doseUnit: 'l/ha', harvestInterval: 0, bufferZone: 5 },
    { name: 'Firebird', mapp: '13400', activeIngredient: 'Flufenacet + Diflufenican + Iodosulfuron', formulation: 'SC', manufacturer: 'Bayer', crops: 'Wheat', maxDoseRate: 0.6, doseUnit: 'l/ha', harvestInterval: 0, bufferZone: 5 },
    { name: 'Avadex Excel 15G', mapp: '11001', activeIngredient: 'Tri-allate', formulation: 'GR', manufacturer: 'Gowan', crops: 'Wheat, Barley', maxDoseRate: 15.0, doseUnit: 'kg/ha', harvestInterval: 0, bufferZone: 0 },
    { name: 'Isomate', mapp: '16120', activeIngredient: 'Isoproturon', formulation: 'SC', manufacturer: 'Nufarm', crops: 'Wheat, Barley', maxDoseRate: 2.5, doseUnit: 'l/ha', harvestInterval: 0, bufferZone: 5 },
    { name: 'Moddus', mapp: '15390', activeIngredient: 'Trinexapac-ethyl', formulation: 'ME', manufacturer: 'Syngenta', crops: 'Wheat, Barley, OSR', maxDoseRate: 0.4, doseUnit: 'l/ha', harvestInterval: 0, bufferZone: 0 },
    { name: 'Plenum WG', mapp: '16800', activeIngredient: 'Pymetrozine', formulation: 'WG', manufacturer: 'Syngenta', crops: 'Cereals, OSR', maxDoseRate: 0.15, doseUnit: 'kg/ha', harvestInterval: 21, bufferZone: 5 },
    { name: 'Corteva Arylex', mapp: '19500', activeIngredient: 'Halauxifen-methyl', formulation: 'EC', manufacturer: 'Corteva', crops: 'Cereals', maxDoseRate: 0.2, doseUnit: 'l/ha', harvestInterval: 42, bufferZone: 5 },
    { name: 'Tracker', mapp: '14100', activeIngredient: 'Sulcotrione + Mesotrione', formulation: 'SC', manufacturer: 'Syngenta', crops: 'Maize', maxDoseRate: 2.0, doseUnit: 'l/ha', harvestInterval: 0, bufferZone: 10 },
    { name: 'Mancozeb 80 WP', mapp: '10050', activeIngredient: 'Mancozeb', formulation: 'WP', manufacturer: 'UPL', crops: 'Potatoes, Wheat', maxDoseRate: 2.0, doseUnit: 'kg/ha', harvestInterval: 7, bufferZone: 5 },
    { name: 'Teppeki', mapp: '17200', activeIngredient: 'Flonicamid', formulation: 'WG', manufacturer: 'Belchim', crops: 'Cereals, OSR', maxDoseRate: 0.14, doseUnit: 'kg/ha', harvestInterval: 21, bufferZone: 5 },
    { name: 'Siltra Xpro', mapp: '18500', activeIngredient: 'Bixafen + Prothioconazole', formulation: 'EC', manufacturer: 'Bayer', crops: 'Wheat, Barley', maxDoseRate: 1.0, doseUnit: 'l/ha', harvestInterval: 35, bufferZone: 5 },
    { name: 'Shark', mapp: '16400', activeIngredient: 'Carfentrazone-ethyl', formulation: 'EW', manufacturer: 'FMC', crops: 'All crops (desiccation)', maxDoseRate: 0.33, doseUnit: 'l/ha', harvestInterval: 3, bufferZone: 5 },
    { name: 'Platform S', mapp: '15900', activeIngredient: 'Pendimethalin + Picolinafen', formulation: 'SC', manufacturer: 'BASF', crops: 'Wheat', maxDoseRate: 2.0, doseUnit: 'l/ha', harvestInterval: 0, bufferZone: 5 },
    { name: 'Centurion Max', mapp: '18700', activeIngredient: 'Clethodim', formulation: 'EC', manufacturer: 'Arysta', crops: 'OSR, Beans', maxDoseRate: 1.0, doseUnit: 'l/ha', harvestInterval: 56, bufferZone: 5 },
    { name: 'Movento', mapp: '17900', activeIngredient: 'Spirotetramat', formulation: 'SC', manufacturer: 'Bayer', crops: 'Cereals, OSR', maxDoseRate: 0.75, doseUnit: 'l/ha', harvestInterval: 21, bufferZone: 5 },
    { name: 'Defy', mapp: '14300', activeIngredient: 'Prosulfocarb', formulation: 'EC', manufacturer: 'Syngenta', crops: 'Wheat, Barley', maxDoseRate: 5.0, doseUnit: 'l/ha', harvestInterval: 0, bufferZone: 5 },
    { name: 'Legacy', mapp: '13800', activeIngredient: 'Chlorotoluron', formulation: 'SC', manufacturer: 'Adama', crops: 'Wheat', maxDoseRate: 3.0, doseUnit: 'l/ha', harvestInterval: 0, bufferZone: 5 },
    { name: 'Spotlight Plus', mapp: '16900', activeIngredient: 'Carfentrazone-ethyl', formulation: 'ME', manufacturer: 'FMC', crops: 'Potatoes (desiccation)', maxDoseRate: 0.6, doseUnit: 'l/ha', harvestInterval: 7, bufferZone: 5 },
    { name: 'Monsoon Active', mapp: '19200', activeIngredient: 'Thifensulfuron-methyl + Metsulfuron-methyl', formulation: 'WG', manufacturer: 'Nufarm', crops: 'Wheat, Barley', maxDoseRate: 0.2, doseUnit: 'kg/ha', harvestInterval: 42, bufferZone: 5 },
    { name: 'Luxinum Plus', mapp: '20300', activeIngredient: 'Bixafen + Fluopyram + Prothioconazole', formulation: 'EC', manufacturer: 'Bayer', crops: 'Wheat', maxDoseRate: 1.5, doseUnit: 'l/ha', harvestInterval: 35, bufferZone: 5 },
    { name: 'Adexar', mapp: '17100', activeIngredient: 'Epoxiconazole + Fluxapyroxad', formulation: 'EC', manufacturer: 'BASF', crops: 'Wheat, Barley', maxDoseRate: 1.5, doseUnit: 'l/ha', harvestInterval: 35, bufferZone: 5 },
    { name: 'Clayton Dyno', mapp: '18100', activeIngredient: 'Glyphosate', formulation: 'SL', manufacturer: 'Clayton', crops: 'All crops', maxDoseRate: 4.0, doseUnit: 'l/ha', harvestInterval: 7, bufferZone: 5 },
    { name: 'Starane XL', mapp: '13500', activeIngredient: 'Fluroxypyr + Florasulam', formulation: 'SE', manufacturer: 'Corteva', crops: 'Wheat, Barley, OSR', maxDoseRate: 1.5, doseUnit: 'l/ha', harvestInterval: 42, bufferZone: 5 },
    { name: 'Flight', mapp: '15100', activeIngredient: 'Dimethomorph + Fluazinam', formulation: 'SC', manufacturer: 'BASF', crops: 'Potatoes', maxDoseRate: 0.5, doseUnit: 'l/ha', harvestInterval: 7, bufferZone: 5 },
    { name: 'Sencorex Flow', mapp: '14500', activeIngredient: 'Metribuzin', formulation: 'SC', manufacturer: 'Bayer', crops: 'Potatoes', maxDoseRate: 1.5, doseUnit: 'l/ha', harvestInterval: 0, bufferZone: 5 },
    { name: 'Bellis', mapp: '16300', activeIngredient: 'Boscalid + Pyraclostrobin', formulation: 'WG', manufacturer: 'BASF', crops: 'Beans, Peas', maxDoseRate: 1.0, doseUnit: 'kg/ha', harvestInterval: 14, bufferZone: 5 },
    { name: 'Propyz', mapp: '18800', activeIngredient: 'Propyzamide', formulation: 'SC', manufacturer: 'Adama', crops: 'OSR', maxDoseRate: 2.1, doseUnit: 'l/ha', harvestInterval: 0, bufferZone: 5 },
    { name: 'Manor', mapp: '12200', activeIngredient: 'Glyphosate', formulation: 'SL', manufacturer: 'Monsanto', crops: 'All crops', maxDoseRate: 5.0, doseUnit: 'l/ha', harvestInterval: 7, bufferZone: 5 },
  ];

  for (const p of pppData) {
    await prisma.pppProduct.create({ data: p });
  }
  console.log(`  ✅ ${pppData.length} PPP products created`);

  // ==================== SPRAY RECORDS ====================
  const sprayDates = [
    '2025-03-05', '2025-03-12', '2025-03-20', '2025-04-02', '2025-04-10',
    '2025-04-18', '2025-04-25', '2025-05-01', '2025-05-08', '2025-05-15',
    '2025-05-22', '2025-06-01', '2025-06-08', '2025-06-15', '2025-06-22',
    '2025-07-01', '2025-07-10', '2025-07-18', '2025-07-25', '2025-08-01',
    '2025-08-10', '2025-08-15', '2025-02-10', '2025-02-20', '2025-01-15',
    '2024-11-10', '2024-11-20', '2024-12-05',
  ];

  const sprayProducts = [
    { productName: 'Atlantis Star', activeIngredient: 'Mesosulfuron-methyl + Thiencarbazone-methyl', doseRate: 0.8, doseUnit: 'l/ha' },
    { productName: 'Proline 275', activeIngredient: 'Prothioconazole', doseRate: 0.56, doseUnit: 'l/ha' },
    { productName: 'Revystar XE', activeIngredient: 'Mefentrifluconazole + Fluxapyroxad', doseRate: 1.2, doseUnit: 'l/ha' },
    { productName: 'Roundup PowerMax', activeIngredient: 'Glyphosate', doseRate: 2.0, doseUnit: 'l/ha' },
    { productName: 'Pixxaro EC', activeIngredient: 'Halauxifen-methyl + Fluroxypyr', doseRate: 0.35, doseUnit: 'l/ha' },
    { productName: 'Hallmark Zeon', activeIngredient: 'Lambda-cyhalothrin', doseRate: 0.05, doseUnit: 'l/ha' },
    { productName: 'Stomp Aqua', activeIngredient: 'Pendimethalin', doseRate: 2.5, doseUnit: 'l/ha' },
    { productName: 'Liberator', activeIngredient: 'Flufenacet + Diflufenican', doseRate: 0.5, doseUnit: 'l/ha' },
    { productName: 'Elatus Era', activeIngredient: 'Benzovindiflupyr + Prothioconazole', doseRate: 0.8, doseUnit: 'l/ha' },
    { productName: 'Kerb Flo 400', activeIngredient: 'Propyzamide', doseRate: 1.75, doseUnit: 'l/ha' },
  ];

  for (let i = 0; i < sprayDates.length; i++) {
    const fieldIdx = i % fields.length;
    const weather = await prisma.sprayWeather.create({
      data: {
        tempC: 8 + Math.random() * 15,
        windSpeedKmh: 2 + Math.random() * 20,
        windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
        humidityPct: 50 + Math.random() * 40,
        rainLast24hMm: Math.random() > 0.7 ? Math.random() * 5 : 0,
        source: 'metoffice',
      },
    });

    const spray = await prisma.sprayRecord.create({
      data: {
        farmId: farm.id,
        fieldId: fields[fieldIdx].id,
        date: new Date(sprayDates[i]),
        operatorId: james.id,
        equipmentId: sprayer.id,
        weatherSnapshotId: weather.id,
        startTime: '08:00',
        endTime: '12:00',
        areaTreatedHa: fields[fieldIdx].hectares,
        reason: ['Pre-emergence herbicide', 'T1 fungicide', 'T2 fungicide', 'Insecticide', 'Growth regulator', 'Desiccation', 'Slug pellets', 'T0 fungicide'][i % 8],
        status: 'complete',
      },
    });

    const prod = sprayProducts[i % sprayProducts.length];
    await prisma.sprayProduct.create({
      data: {
        sprayRecordId: spray.id,
        ...prod,
        areaTreated: fields[fieldIdx].hectares,
        batchNumber: `B${2025}${String(i + 1).padStart(3, '0')}`,
      },
    });
  }
  console.log(`  ✅ ${sprayDates.length} spray records created`);

  // ==================== ANIMAL GROUPS ====================
  const breedingHerd = await prisma.animalGroup.create({ data: { farmId: farm.id, name: 'Breeding Herd', species: 'cattle' } });
  const storeCattle = await prisma.animalGroup.create({ data: { farmId: farm.id, name: 'Store Cattle', species: 'cattle' } });
  const youngstock = await prisma.animalGroup.create({ data: { farmId: farm.id, name: 'Youngstock', species: 'cattle' } });
  const bulls = await prisma.animalGroup.create({ data: { farmId: farm.id, name: 'Bulls', species: 'cattle' } });
  const ewes = await prisma.animalGroup.create({ data: { farmId: farm.id, name: 'Ewes', species: 'sheep' } });
  const rams = await prisma.animalGroup.create({ data: { farmId: farm.id, name: 'Rams', species: 'sheep' } });
  const lambs = await prisma.animalGroup.create({ data: { farmId: farm.id, name: 'Lambs', species: 'sheep' } });
  console.log('  ✅ 7 animal groups created');

  // ==================== CATTLE (50) ====================
  const cattleBreeds = ['Hereford', 'Angus', 'Limousin', 'Charolais', 'Simmental', 'British Blue', 'Highland'];
  const cattleGroups = [breedingHerd.id, breedingHerd.id, breedingHerd.id, storeCattle.id, youngstock.id, bulls.id, breedingHerd.id];
  const cattleIds: string[] = [];
  for (let i = 0; i < 50; i++) {
    const tagNum = String(100001 + i);
    const isMale = i < 5;
    const animal = await prisma.animal.create({
      data: {
        farmId: farm.id,
        earTag: `UK ${farm.cphNumber?.replace(/\//g, ' ')} ${tagNum}`,
        eidNumber: `826 ${String(Math.floor(Math.random() * 999999999999)).padStart(12, '0')}`,
        species: 'cattle',
        breed: cattleBreeds[i % cattleBreeds.length],
        sex: isMale ? 'male' : 'female',
        dob: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), 1 + Math.floor(Math.random() * 28)),
        status: i < 42 ? 'alive' : i < 45 ? 'sold' : i < 48 ? 'dead' : 'alive',
        groupId: isMale ? bulls.id : cattleGroups[i % cattleGroups.length],
        soldDate: i >= 42 && i < 45 ? new Date(2026, 0, 10 + i) : undefined,
        deathDate: i >= 45 && i < 48 ? new Date(2025, 11, 1 + i) : undefined,
        passportNumber: `UK${farm.cphNumber?.replace(/\//g, '')}${tagNum}P`,
      },
    });
    cattleIds.push(animal.id);
  }
  console.log('  ✅ 50 cattle created');

  // ==================== SHEEP (200) ====================
  const sheepBreeds = ['Texel', 'Suffolk', 'Mule', 'Welsh Mountain', 'Lleyn', 'Hampshire Down', 'Cheviot'];
  const sheepIds: string[] = [];
  for (let i = 0; i < 200; i++) {
    const tagNum = String(200001 + i);
    const isMale = i < 15;
    const animal = await prisma.animal.create({
      data: {
        farmId: farm.id,
        earTag: `UK ${farm.cphNumber?.replace(/\//g, ' ')} ${tagNum}`,
        eidNumber: `826 ${String(Math.floor(Math.random() * 999999999999)).padStart(12, '0')}`,
        species: 'sheep',
        breed: sheepBreeds[i % sheepBreeds.length],
        sex: isMale ? 'male' : 'female',
        dob: new Date(2021 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), 1 + Math.floor(Math.random() * 28)),
        status: i < 185 ? 'alive' : i < 190 ? 'sold' : i < 195 ? 'dead' : 'alive',
        groupId: isMale ? rams.id : (i >= 185 ? lambs.id : ewes.id),
        soldDate: i >= 185 && i < 190 ? new Date(2026, 0, 5 + i) : undefined,
        deathDate: i >= 190 && i < 195 ? new Date(2025, 10, 1 + i) : undefined,
      },
    });
    sheepIds.push(animal.id);
  }
  console.log('  ✅ 200 sheep created');

  // ==================== MOVEMENTS ====================
  const movementData = [
    { fromCph: '23/456/7890', toCph: farm.cphNumber || '12/345/6789', date: new Date(2026, 2, 12), movementType: 'on', haulier: 'Self', vehicleReg: 'AB12 CDE', species: 'cattle', animalCount: 3, bcmsSubmitted: false, notes: 'Bought 3 heifers from Exeter market' },
    { fromCph: farm.cphNumber || '12/345/6789', toCph: '12/345/6780', date: new Date(2026, 1, 5), movementType: 'between', haulier: 'Self', vehicleReg: 'AB12 CDE', species: 'cattle', animalCount: 8, bcmsSubmitted: true, notes: 'Moved to out-farm for grazing' },
    { fromCph: farm.cphNumber || '12/345/6789', toCph: '34/567/8901', date: new Date(2026, 0, 12), movementType: 'off', haulier: 'Livestock Transport Ltd', vehicleReg: 'XY67 FGH', species: 'cattle', animalCount: 5, bcmsSubmitted: true, notes: 'Sold to ABP Abattoir' },
    { fromCph: '45/678/9012', toCph: farm.cphNumber || '12/345/6789', date: new Date(2026, 2, 14), movementType: 'on', haulier: 'Farm Haulage', vehicleReg: 'CD34 EFG', species: 'cattle', animalCount: 2, bcmsSubmitted: false, departureTime: '08:00', journeyDuration: 2, standstillEnd: new Date(2026, 2, 20), notes: 'Purchased from Taunton market' },
  ];
  for (const mv of movementData) {
    const movement = await prisma.movement.create({ data: { farmId: farm.id, ...mv } });
    // Link first few cattle to movements
    const startIdx = mv.movementType === 'on' ? 38 : mv.movementType === 'off' ? 42 : 30;
    for (let j = 0; j < Math.min(mv.animalCount, 5); j++) {
      if (cattleIds[startIdx + j]) {
        await prisma.movementAnimal.create({ data: { animalId: cattleIds[startIdx + j], movementId: movement.id } });
      }
    }
  }
  console.log('  ✅ 4 movements created');

  // ==================== BREEDING RECORDS ====================
  const femaleCattle = cattleIds.slice(5, 30); // females
  const sireId = cattleIds[0]; // first bull
  for (let i = 0; i < 8; i++) {
    const serviceDate = new Date(2025, 4 + Math.floor(i / 3), 1 + i * 3);
    const expectedCalving = new Date(serviceDate);
    expectedCalving.setDate(expectedCalving.getDate() + 283);
    const hasCalved = i < 3;
    const calvingDate = hasCalved ? new Date(expectedCalving.getTime() - Math.floor(Math.random() * 5) * 86400000) : undefined;

    await prisma.breedingRecord.create({
      data: {
        farmId: farm.id,
        damId: femaleCattle[i],
        sireId: i % 3 === 0 ? sireId : undefined,
        sireName: i % 3 !== 0 ? 'AI Hereford Bull (NM2280)' : undefined,
        serviceDate,
        method: i % 3 !== 0 ? 'ai' : 'natural',
        expectedCalving,
        calvingDate,
        calfSex: hasCalved ? (i % 2 === 0 ? 'male' : 'female') : undefined,
        calfBreed: hasCalved ? 'Hereford x' : undefined,
        calfWeight: hasCalved ? 35 + Math.floor(Math.random() * 10) : undefined,
        assisted: hasCalved && i === 2,
        notes: hasCalved ? 'Healthy calf, good condition' : undefined,
      },
    });
  }
  console.log('  ✅ 8 breeding records created');

  // ==================== MEDICINE RECORDS FOR ANIMALS ====================
  const medRecord1 = await prisma.medicineRecord.create({
    data: {
      farmId: farm.id, date: new Date(2026, 2, 10), productName: 'Alamycin LA 300',
      batchNumber: 'ALM-2026-001', dose: '15ml', route: 'injection',
      withdrawalMeatDays: 28, withdrawalMilkDays: 7,
      withdrawalEndDate: new Date(2026, 3, 7), vetName: 'Mr. Williams',
      reason: 'Respiratory infection', notes: 'Follow up in 5 days',
    },
  });
  await prisma.animalMedicine.create({ data: { animalId: cattleIds[8], medicineRecordId: medRecord1.id } });
  await prisma.animalMedicine.create({ data: { animalId: cattleIds[9], medicineRecordId: medRecord1.id } });

  const medRecord2 = await prisma.medicineRecord.create({
    data: {
      farmId: farm.id, date: new Date(2026, 2, 5), productName: 'Closamectin Pour-On',
      batchNumber: 'CLO-2026-003', dose: '10ml', route: 'pour-on',
      withdrawalMeatDays: 28, withdrawalMilkDays: 0,
      withdrawalEndDate: new Date(2026, 3, 2),
      reason: 'Routine worming',
    },
  });
  for (let j = 10; j < 18; j++) {
    await prisma.animalMedicine.create({ data: { animalId: cattleIds[j], medicineRecordId: medRecord2.id } });
  }
  console.log('  ✅ 2 medicine records with animal links created');

  // ==================== VET MEDICINES ====================
  const vetMeds = [
    { name: 'Alamycin LA 300', activeIngredient: 'Oxytetracycline', species: 'cattle,sheep', defaultDose: '1ml/10kg', route: 'injection', withdrawalMeatDays: 28, withdrawalMilkDays: 7, pomStatus: 'POM-V', manufacturer: 'Norbrook' },
    { name: 'Betamox LA', activeIngredient: 'Amoxicillin', species: 'cattle', defaultDose: '1ml/10kg', route: 'injection', withdrawalMeatDays: 22, withdrawalMilkDays: 3, pomStatus: 'POM-V', manufacturer: 'Norbrook' },
    { name: 'Butalex', activeIngredient: 'Buparvaquone', species: 'cattle', defaultDose: '1ml/20kg', route: 'injection', withdrawalMeatDays: 42, withdrawalMilkDays: 2, pomStatus: 'POM-V', manufacturer: 'MSD' },
    { name: 'Cevaxel RTU', activeIngredient: 'Ceftiofur', species: 'cattle', defaultDose: '1ml/50kg', route: 'injection', withdrawalMeatDays: 9, withdrawalMilkDays: 0, pomStatus: 'POM-V', manufacturer: 'Ceva' },
    { name: 'Closamectin Pour-On', activeIngredient: 'Closantel + Ivermectin', species: 'cattle', defaultDose: '1ml/10kg', route: 'pour-on', withdrawalMeatDays: 28, withdrawalMilkDays: 0, pomStatus: 'POM-VPS', manufacturer: 'Norbrook' },
    { name: 'Dectomax Pour-On', activeIngredient: 'Doramectin', species: 'cattle', defaultDose: '1ml/10kg', route: 'pour-on', withdrawalMeatDays: 35, withdrawalMilkDays: 0, pomStatus: 'POM-VPS', manufacturer: 'Elanco' },
    { name: 'Excenel RTU', activeIngredient: 'Ceftiofur', species: 'cattle,sheep', defaultDose: '1ml/50kg', route: 'injection', withdrawalMeatDays: 6, withdrawalMilkDays: 0, pomStatus: 'POM-V', manufacturer: 'Zoetis' },
    { name: 'Finadyne Transdermal', activeIngredient: 'Flunixin', species: 'cattle', defaultDose: '3.33ml/100kg', route: 'pour-on', withdrawalMeatDays: 7, withdrawalMilkDays: 36, pomStatus: 'POM-V', manufacturer: 'MSD' },
    { name: 'Ivomec Classic', activeIngredient: 'Ivermectin', species: 'cattle,sheep', defaultDose: '1ml/50kg', route: 'injection', withdrawalMeatDays: 49, withdrawalMilkDays: 0, pomStatus: 'POM-VPS', manufacturer: 'Boehringer' },
    { name: 'Ketofen 10%', activeIngredient: 'Ketoprofen', species: 'cattle', defaultDose: '3ml/100kg', route: 'injection', withdrawalMeatDays: 4, withdrawalMilkDays: 0, pomStatus: 'POM-V', manufacturer: 'Ceva' },
    { name: 'Metacam 20mg/ml', activeIngredient: 'Meloxicam', species: 'cattle', defaultDose: '2.5ml/100kg', route: 'injection', withdrawalMeatDays: 15, withdrawalMilkDays: 5, pomStatus: 'POM-V', manufacturer: 'Boehringer' },
    { name: 'Nuflor', activeIngredient: 'Florfenicol', species: 'cattle', defaultDose: '1ml/15kg', route: 'injection', withdrawalMeatDays: 44, withdrawalMilkDays: 0, pomStatus: 'POM-V', manufacturer: 'MSD' },
    { name: 'Oramec Drench', activeIngredient: 'Ivermectin', species: 'sheep', defaultDose: '2.5ml/10kg', route: 'oral', withdrawalMeatDays: 14, withdrawalMilkDays: 0, pomStatus: 'POM-VPS', manufacturer: 'Boehringer' },
    { name: 'Rispoval RS+PI3 IntraNasal', activeIngredient: 'RSV + PI3 vaccine', species: 'cattle', defaultDose: '2ml', route: 'intranasal', withdrawalMeatDays: 0, withdrawalMilkDays: 0, pomStatus: 'POM-V', manufacturer: 'Zoetis' },
    { name: 'Synulox RTU', activeIngredient: 'Amoxicillin + Clavulanic acid', species: 'cattle', defaultDose: '1ml/20kg', route: 'injection', withdrawalMeatDays: 28, withdrawalMilkDays: 3, pomStatus: 'POM-V', manufacturer: 'Zoetis' },
    { name: 'Tylan 200', activeIngredient: 'Tylosin', species: 'cattle', defaultDose: '1ml/20kg', route: 'injection', withdrawalMeatDays: 28, withdrawalMilkDays: 4, pomStatus: 'POM-V', manufacturer: 'Elanco' },
    { name: 'Zuprevo 180', activeIngredient: 'Tildipirosin', species: 'cattle', defaultDose: '1ml/30kg', route: 'injection', withdrawalMeatDays: 33, withdrawalMilkDays: 0, pomStatus: 'POM-V', manufacturer: 'MSD' },
    { name: 'Bovilis BVD', activeIngredient: 'BVD vaccine', species: 'cattle', defaultDose: '2ml', route: 'injection', withdrawalMeatDays: 0, withdrawalMilkDays: 0, pomStatus: 'POM-V', manufacturer: 'MSD' },
    { name: 'Zactran', activeIngredient: 'Gamithromycin', species: 'cattle', defaultDose: '1ml/25kg', route: 'injection', withdrawalMeatDays: 64, withdrawalMilkDays: 0, pomStatus: 'POM-V', manufacturer: 'Boehringer' },
    { name: 'Covexin 8', activeIngredient: 'Clostridial vaccine', species: 'cattle,sheep', defaultDose: '2ml', route: 'injection', withdrawalMeatDays: 0, withdrawalMilkDays: 0, pomStatus: 'POM-VPS', manufacturer: 'MSD' },
    { name: 'Cydectin 0.1%', activeIngredient: 'Moxidectin', species: 'sheep', defaultDose: '1ml/5kg', route: 'oral', withdrawalMeatDays: 14, withdrawalMilkDays: 5, pomStatus: 'POM-VPS', manufacturer: 'Elanco' },
    { name: 'Flukiver 5%', activeIngredient: 'Closantel', species: 'sheep', defaultDose: '1ml/5kg', route: 'oral', withdrawalMeatDays: 28, withdrawalMilkDays: 0, pomStatus: 'POM-VPS', manufacturer: 'Elanco' },
    { name: 'Heptavac-P Plus', activeIngredient: 'Clostridial + Pasteurella vaccine', species: 'sheep', defaultDose: '2ml', route: 'injection', withdrawalMeatDays: 0, withdrawalMilkDays: 0, pomStatus: 'POM-VPS', manufacturer: 'MSD' },
    { name: 'Levafas Diamond', activeIngredient: 'Levamisole + Oxyclozanide', species: 'cattle,sheep', defaultDose: '1ml/5kg', route: 'oral', withdrawalMeatDays: 13, withdrawalMilkDays: 4, pomStatus: 'POM-VPS', manufacturer: 'Norbrook' },
    { name: 'Panacur 10%', activeIngredient: 'Fenbendazole', species: 'cattle,sheep', defaultDose: '1ml/10kg', route: 'oral', withdrawalMeatDays: 14, withdrawalMilkDays: 5, pomStatus: 'POM-VPS', manufacturer: 'MSD' },
    { name: 'Provita Ewe Plus', activeIngredient: 'Vitamins + minerals', species: 'sheep', defaultDose: '10ml', route: 'oral', withdrawalMeatDays: 0, withdrawalMilkDays: 0, pomStatus: 'NFA-VPS', manufacturer: 'Provita' },
    { name: 'Scabigard', activeIngredient: 'Orf vaccine', species: 'sheep', defaultDose: 'Scratch dose', route: 'topical', withdrawalMeatDays: 0, withdrawalMilkDays: 0, pomStatus: 'POM-V', manufacturer: 'MSD' },
    { name: 'Tribovax 10', activeIngredient: 'Clostridial vaccine', species: 'cattle,sheep', defaultDose: '2ml', route: 'injection', withdrawalMeatDays: 0, withdrawalMilkDays: 0, pomStatus: 'POM-VPS', manufacturer: 'MSD' },
    { name: 'Vetrimoxin LA', activeIngredient: 'Amoxicillin', species: 'cattle,sheep', defaultDose: '1ml/10kg', route: 'injection', withdrawalMeatDays: 36, withdrawalMilkDays: 4, pomStatus: 'POM-V', manufacturer: 'Ceva' },
    { name: 'Zolvix', activeIngredient: 'Monepantel', species: 'sheep', defaultDose: '1ml/10kg', route: 'oral', withdrawalMeatDays: 7, withdrawalMilkDays: 0, pomStatus: 'POM-VPS', manufacturer: 'Elanco' },
    { name: 'Startect', activeIngredient: 'Abamectin + Derquantel', species: 'sheep', defaultDose: '1ml/5kg', route: 'oral', withdrawalMeatDays: 35, withdrawalMilkDays: 0, pomStatus: 'POM-VPS', manufacturer: 'Zoetis' },
    { name: 'Dexafort', activeIngredient: 'Dexamethasone', species: 'cattle', defaultDose: '1ml/100kg', route: 'injection', withdrawalMeatDays: 21, withdrawalMilkDays: 3, pomStatus: 'POM-V', manufacturer: 'MSD' },
    { name: 'Norodine 24', activeIngredient: 'Sulfadiazine + Trimethoprim', species: 'cattle', defaultDose: '1ml/16kg', route: 'injection', withdrawalMeatDays: 10, withdrawalMilkDays: 3, pomStatus: 'POM-V', manufacturer: 'Norbrook' },
    { name: 'Engemycin 10%', activeIngredient: 'Oxytetracycline', species: 'cattle,sheep', defaultDose: '1ml/10kg', route: 'injection', withdrawalMeatDays: 21, withdrawalMilkDays: 7, pomStatus: 'POM-V', manufacturer: 'MSD' },
    { name: 'Marbocyl 10%', activeIngredient: 'Marbofloxacin', species: 'cattle', defaultDose: '1ml/50kg', route: 'injection', withdrawalMeatDays: 6, withdrawalMilkDays: 3, pomStatus: 'POM-V', manufacturer: 'Vetoquinol' },
    { name: 'Draxxin', activeIngredient: 'Tulathromycin', species: 'cattle', defaultDose: '1ml/40kg', route: 'injection', withdrawalMeatDays: 49, withdrawalMilkDays: 0, pomStatus: 'POM-V', manufacturer: 'Zoetis' },
    { name: 'Shotapen LA', activeIngredient: 'Benzylpenicillin + Dihydrostreptomycin', species: 'cattle,sheep', defaultDose: '1ml/25kg', route: 'injection', withdrawalMeatDays: 30, withdrawalMilkDays: 5, pomStatus: 'POM-V', manufacturer: 'Virbac' },
    { name: 'Metacam 15mg/ml', activeIngredient: 'Meloxicam', species: 'cattle', defaultDose: '1ml/15kg', route: 'oral', withdrawalMeatDays: 15, withdrawalMilkDays: 5, pomStatus: 'POM-V', manufacturer: 'Boehringer' },
    { name: 'Bovilis Bovipast RSP', activeIngredient: 'RSV + PI3 + Mannheimia vaccine', species: 'cattle', defaultDose: '5ml', route: 'injection', withdrawalMeatDays: 0, withdrawalMilkDays: 0, pomStatus: 'POM-V', manufacturer: 'MSD' },
    { name: 'Footvax', activeIngredient: 'D. nodosus vaccine', species: 'sheep', defaultDose: '1ml', route: 'injection', withdrawalMeatDays: 0, withdrawalMilkDays: 0, pomStatus: 'POM-VPS', manufacturer: 'MSD' },
    { name: 'Enzovax', activeIngredient: 'Enzootic abortion vaccine', species: 'sheep', defaultDose: '2ml', route: 'injection', withdrawalMeatDays: 0, withdrawalMilkDays: 0, pomStatus: 'POM-V', manufacturer: 'MSD' },
    { name: 'Toxovax', activeIngredient: 'Toxoplasmosis vaccine', species: 'sheep', defaultDose: '2ml', route: 'injection', withdrawalMeatDays: 0, withdrawalMilkDays: 0, pomStatus: 'POM-V', manufacturer: 'MSD' },
    { name: 'Rilexine 600 LA', activeIngredient: 'Cefalexin', species: 'cattle', defaultDose: '1ml/30kg', route: 'injection', withdrawalMeatDays: 14, withdrawalMilkDays: 2, pomStatus: 'POM-V', manufacturer: 'Virbac' },
    { name: 'Borgal 24%', activeIngredient: 'Sulfadoxine + Trimethoprim', species: 'cattle,sheep', defaultDose: '1ml/16kg', route: 'injection', withdrawalMeatDays: 12, withdrawalMilkDays: 3, pomStatus: 'POM-V', manufacturer: 'MSD' },
    { name: 'Wormectin Pour-On', activeIngredient: 'Ivermectin', species: 'cattle', defaultDose: '1ml/10kg', route: 'pour-on', withdrawalMeatDays: 28, withdrawalMilkDays: 0, pomStatus: 'POM-VPS', manufacturer: 'Norbrook' },
    { name: 'Vecoxan', activeIngredient: 'Diclazuril', species: 'cattle,sheep', defaultDose: '1ml/2.5kg', route: 'oral', withdrawalMeatDays: 0, withdrawalMilkDays: 0, pomStatus: 'POM-VPS', manufacturer: 'Elanco' },
    { name: 'Baycox Sheep', activeIngredient: 'Toltrazuril', species: 'sheep', defaultDose: '1ml/2.5kg', route: 'oral', withdrawalMeatDays: 42, withdrawalMilkDays: 0, pomStatus: 'POM-VPS', manufacturer: 'Elanco' },
    { name: 'Imrestor', activeIngredient: 'Pegbovigrastim', species: 'cattle', defaultDose: '15ml', route: 'injection', withdrawalMeatDays: 16, withdrawalMilkDays: 0, pomStatus: 'POM-V', manufacturer: 'Elanco' },
    { name: 'Clik Extra', activeIngredient: 'Dicyclanil', species: 'sheep', defaultDose: '30ml/sheep', route: 'pour-on', withdrawalMeatDays: 40, withdrawalMilkDays: 0, pomStatus: 'NFA-VPS', manufacturer: 'Elanco' },
    { name: 'Dystosel', activeIngredient: 'Sodium selenite + Vitamin E', species: 'cattle,sheep', defaultDose: '1ml/50kg', route: 'injection', withdrawalMeatDays: 0, withdrawalMilkDays: 0, pomStatus: 'POM-VPS', manufacturer: 'Zoetis' },
  ];

  for (const m of vetMeds) {
    await prisma.vetMedicine.create({ data: m });
  }
  console.log(`  ✅ ${vetMeds.length} vet medicines created`);

  // ==================== MEDICINE RECORDS (15+) ====================
  const animals = await prisma.animal.findMany({ where: { farmId: farm.id, species: 'cattle', status: 'alive' }, take: 20 });
  const medDates = [
    '2025-01-10', '2025-01-25', '2025-02-05', '2025-02-15', '2025-03-01',
    '2025-03-10', '2025-03-15', '2025-04-01', '2025-04-15', '2025-05-01',
    '2025-05-15', '2025-06-01', '2025-06-15', '2025-07-01', '2025-07-15',
    '2025-08-01', '2025-08-10',
  ];

  const medProducts = [
    { productName: 'Alamycin LA 300', dose: '15ml', route: 'injection', withdrawalMeatDays: 28, withdrawalMilkDays: 7, reason: 'Pneumonia treatment' },
    { productName: 'Metacam 20mg/ml', dose: '12.5ml', route: 'injection', withdrawalMeatDays: 15, withdrawalMilkDays: 5, reason: 'Lameness - anti-inflammatory' },
    { productName: 'Covexin 8', dose: '2ml', route: 'injection', withdrawalMeatDays: 0, withdrawalMilkDays: 0, reason: 'Annual clostridial vaccination' },
    { productName: 'Closamectin Pour-On', dose: '50ml', route: 'pour-on', withdrawalMeatDays: 28, withdrawalMilkDays: 0, reason: 'Worming + fluke treatment' },
    { productName: 'Synulox RTU', dose: '25ml', route: 'injection', withdrawalMeatDays: 28, withdrawalMilkDays: 3, reason: 'Foot infection' },
    { productName: 'Bovilis BVD', dose: '2ml', route: 'injection', withdrawalMeatDays: 0, withdrawalMilkDays: 0, reason: 'BVD vaccination' },
    { productName: 'Nuflor', dose: '20ml', route: 'injection', withdrawalMeatDays: 44, withdrawalMilkDays: 0, reason: 'Respiratory disease' },
    { productName: 'Dectomax Pour-On', dose: '50ml', route: 'pour-on', withdrawalMeatDays: 35, withdrawalMilkDays: 0, reason: 'Autumn worming' },
    { productName: 'Ketofen 10%', dose: '15ml', route: 'injection', withdrawalMeatDays: 4, withdrawalMilkDays: 0, reason: 'Pain relief post-calving' },
    { productName: 'Rispoval RS+PI3 IntraNasal', dose: '2ml', route: 'intranasal', withdrawalMeatDays: 0, withdrawalMilkDays: 0, reason: 'RSV vaccination calves' },
    { productName: 'Betamox LA', dose: '50ml', route: 'injection', withdrawalMeatDays: 22, withdrawalMilkDays: 3, reason: 'Mastitis treatment' },
    { productName: 'Finadyne Transdermal', dose: '16ml', route: 'pour-on', withdrawalMeatDays: 7, withdrawalMilkDays: 36, reason: 'Pyrexia / fever' },
    { productName: 'Ivomec Classic', dose: '10ml', route: 'injection', withdrawalMeatDays: 49, withdrawalMilkDays: 0, reason: 'Housing wormer' },
    { productName: 'Zuprevo 180', dose: '16ml', route: 'injection', withdrawalMeatDays: 33, withdrawalMilkDays: 0, reason: 'BRD treatment' },
    { productName: 'Tylan 200', dose: '25ml', route: 'injection', withdrawalMeatDays: 28, withdrawalMilkDays: 4, reason: 'Liver abscess prevention' },
    { productName: 'Cevaxel RTU', dose: '10ml', route: 'injection', withdrawalMeatDays: 9, withdrawalMilkDays: 0, reason: 'Foot rot treatment' },
    { productName: 'Draxxin', dose: '12.5ml', route: 'injection', withdrawalMeatDays: 49, withdrawalMilkDays: 0, reason: 'Pneumonia - metaphylaxis' },
  ];

  for (let i = 0; i < medDates.length; i++) {
    const med = medProducts[i];
    const withdrawalEnd = med.withdrawalMeatDays > 0
      ? new Date(new Date(medDates[i]).getTime() + med.withdrawalMeatDays * 86400000)
      : null;

    const record = await prisma.medicineRecord.create({
      data: {
        farmId: farm.id,
        date: new Date(medDates[i]),
        productName: med.productName,
        batchNumber: `VM${2025}${String(i + 1).padStart(3, '0')}`,
        dose: med.dose,
        route: med.route,
        withdrawalMeatDays: med.withdrawalMeatDays,
        withdrawalMilkDays: med.withdrawalMilkDays,
        withdrawalEndDate: withdrawalEnd,
        vetName: i % 3 === 0 ? 'Mr. A. Williams MRCVS' : 'Ms. L. Carter MRCVS',
        reason: med.reason,
      },
    });

    // Assign 1-5 animals to each record
    const numAnimals = Math.min(1 + Math.floor(Math.random() * 5), animals.length);
    for (let j = 0; j < numAnimals; j++) {
      const animalIdx = (i * 3 + j) % animals.length;
      await prisma.animalMedicine.create({
        data: { animalId: animals[animalIdx].id, medicineRecordId: record.id },
      }).catch(() => {}); // skip duplicates
    }
  }
  console.log(`  ✅ ${medDates.length} medicine records created`);

  // ==================== ADDITIONAL MOVEMENTS (historical) ====================
  const historicalMovements = [
    { fromCph: '12/345/6789', toCph: '98/765/4321', date: '2025-01-20', haulier: 'County Livestock Haulage', vehicleReg: 'AB23 CDE', movementType: 'off', animalCount: 8, species: 'cattle', bcmsSubmitted: true, bcmsRef: 'BCMS-2025-001' },
    { fromCph: '45/678/1234', toCph: '12/345/6789', date: '2025-02-10', haulier: 'Self', vehicleReg: 'FG24 HIJ', movementType: 'on', animalCount: 12, species: 'cattle', bcmsSubmitted: true, bcmsRef: 'BCMS-2025-002' },
    { fromCph: '12/345/6789', toCph: '12/345/6789', date: '2025-03-01', movementType: 'between', animalCount: 20, species: 'sheep', notes: 'Hill Ground to Home Paddock for lambing' },
    { fromCph: '12/345/6789', toCph: 'MARKET/SOM/001', date: '2025-03-15', haulier: 'Somerset Livestock Transport', vehicleReg: 'KL25 MNO', movementType: 'off', animalCount: 30, species: 'sheep', bcmsSubmitted: false },
    { fromCph: '12/345/6789', toCph: '34/567/8901', date: '2025-04-01', haulier: 'Self', vehicleReg: 'FG24 HIJ', movementType: 'off', animalCount: 5, species: 'cattle', bcmsSubmitted: true, bcmsRef: 'BCMS-2025-004' },
    { fromCph: '56/789/0123', toCph: '12/345/6789', date: '2025-04-15', haulier: 'Premier Livestock Haulage', vehicleReg: 'PQ26 RST', movementType: 'on', animalCount: 3, species: 'cattle', bcmsSubmitted: true, bcmsRef: 'BCMS-2025-005' },
    { fromCph: '12/345/6789', toCph: 'MARKET/DEV/003', date: '2025-07-15', haulier: 'County Livestock Haulage', vehicleReg: 'AB23 CDE', movementType: 'off', animalCount: 25, species: 'sheep', notes: 'Cull ewes to market' },
  ];

  for (const m of historicalMovements) {
    await prisma.movement.create({
      data: {
        farmId: farm.id,
        fromCph: m.fromCph,
        toCph: m.toCph,
        date: new Date(m.date),
        haulier: m.haulier || null,
        vehicleReg: m.vehicleReg || null,
        movementType: m.movementType,
        animalCount: m.animalCount,
        species: m.species,
        bcmsSubmitted: m.bcmsSubmitted || false,
        bcmsRef: m.bcmsRef || null,
        notes: m.notes || null,
      },
    });
  }
  console.log(`  ✅ ${historicalMovements.length} historical movements created`);

  // ==================== FERTILISER RECORDS (15+) ====================
  const fertData = [
    { fieldIdx: 0, date: '2025-02-15', productType: 'chemical', productName: 'Nitram 34.5%N', rateKgHa: 150, nContent: 51.75, pContent: 0, kContent: 0, method: 'broadcast' },
    { fieldIdx: 0, date: '2025-04-01', productType: 'chemical', productName: 'Nitram 34.5%N', rateKgHa: 200, nContent: 69, pContent: 0, kContent: 0, method: 'broadcast' },
    { fieldIdx: 1, date: '2025-03-10', productType: 'chemical', productName: 'Nitram 34.5%N', rateKgHa: 120, nContent: 41.4, pContent: 0, kContent: 0, method: 'broadcast' },
    { fieldIdx: 3, date: '2025-02-20', productType: 'chemical', productName: 'Double Top 27%N 12%SO3', rateKgHa: 250, nContent: 67.5, pContent: 0, kContent: 0, method: 'broadcast' },
    { fieldIdx: 4, date: '2025-02-25', productType: 'chemical', productName: 'Nitram 34.5%N', rateKgHa: 180, nContent: 62.1, pContent: 0, kContent: 0, method: 'broadcast' },
    { fieldIdx: 0, date: '2024-09-15', productType: 'chemical', productName: 'DAP 18-46-0', rateKgHa: 200, nContent: 36, pContent: 92, kContent: 0, method: 'broadcast' },
    { fieldIdx: 1, date: '2025-03-05', productType: 'chemical', productName: 'MOP 0-0-60', rateKgHa: 100, nContent: 0, pContent: 0, kContent: 60, method: 'broadcast' },
    { fieldIdx: 2, date: '2025-03-20', productType: 'organic', productName: 'Farmyard Manure', rateKgHa: 25000, nContent: 150, pContent: 75, kContent: 200, method: 'broadcast' },
    { fieldIdx: 5, date: '2025-04-10', productType: 'organic', productName: 'Farmyard Manure', rateKgHa: 20000, nContent: 120, pContent: 60, kContent: 160, method: 'broadcast' },
    { fieldIdx: 7, date: '2025-03-15', productType: 'slurry', productName: 'Cattle Slurry', rateKgHa: 35000, nContent: 105, pContent: 42, kContent: 122.5, method: 'injection' },
    { fieldIdx: 0, date: '2025-05-01', productType: 'chemical', productName: 'Nitram 34.5%N', rateKgHa: 150, nContent: 51.75, pContent: 0, kContent: 0, method: 'precision' },
    { fieldIdx: 3, date: '2025-04-15', productType: 'chemical', productName: 'Sulphate of Ammonia 21%N', rateKgHa: 200, nContent: 42, pContent: 0, kContent: 0, method: 'broadcast' },
    { fieldIdx: 4, date: '2025-04-20', productType: 'chemical', productName: 'Nitram 34.5%N', rateKgHa: 170, nContent: 58.65, pContent: 0, kContent: 0, method: 'precision' },
    { fieldIdx: 7, date: '2025-05-10', productType: 'chemical', productName: 'Nitram 34.5%N', rateKgHa: 130, nContent: 44.85, pContent: 0, kContent: 0, method: 'broadcast' },
    { fieldIdx: 1, date: '2025-05-05', productType: 'chemical', productName: 'Triple Super Phosphate 0-46-0', rateKgHa: 100, nContent: 0, pContent: 46, kContent: 0, method: 'broadcast' },
    { fieldIdx: 3, date: '2024-10-01', productType: 'manure', productName: 'Chicken Litter', rateKgHa: 8000, nContent: 240, pContent: 176, kContent: 128, method: 'broadcast' },
  ];

  for (const f of fertData) {
    await prisma.fertiliserRecord.create({
      data: {
        farmId: farm.id,
        fieldId: fields[f.fieldIdx].id,
        date: new Date(f.date),
        productType: f.productType,
        productName: f.productName,
        rateKgHa: f.rateKgHa,
        nContent: f.nContent,
        pContent: f.pContent,
        kContent: f.kContent,
        method: f.method,
        operatorId: james.id,
      },
    });
  }
  console.log(`  ✅ ${fertData.length} fertiliser records created`);

  // ==================== SFI AGREEMENT ====================
  const sfi = await prisma.sfiAgreement.create({
    data: {
      farmId: farm.id,
      sfiRef: 'SFI-2024-OAK-001',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2026-12-31'),
      totalAnnualPayment: 8450,
      status: 'active',
    },
  });

  const sfiActions = [
    { actionCode: 'SAM1', actionName: 'Assess soil health', fieldIdx: 0, hectares: 24.5, paymentPerHa: 6, evidenceRequired: 'Soil health assessment report' },
    { actionCode: 'SAM2', actionName: 'Multi-species cover crop', fieldIdx: 1, hectares: 18.3, paymentPerHa: 129, evidenceRequired: 'Photos of cover crop establishment' },
    { actionCode: 'SAM3', actionName: 'No use of insecticide', fieldIdx: 3, hectares: 32.1, paymentPerHa: 45, evidenceRequired: 'Spray records showing no insecticide' },
    { actionCode: 'HRW1', actionName: 'Assess hedgerow condition', fieldIdx: null, hectares: null, paymentPerHa: 5, evidenceRequired: 'Hedgerow condition assessment' },
    { actionCode: 'HRW2', actionName: 'Manage hedgerows', fieldIdx: null, hectares: null, paymentPerHa: 13, evidenceRequired: 'Photos before and after management' },
    { actionCode: 'AHL1', actionName: 'Pollen and nectar flower mix', fieldIdx: 6, hectares: 4.0, paymentPerHa: 614, evidenceRequired: 'GPS-tagged photos of flower mix' },
    { actionCode: 'IGL1', actionName: 'Take integrated pest management approach', fieldIdx: 0, hectares: 24.5, paymentPerHa: 30, evidenceRequired: 'IPM plan document' },
    { actionCode: 'NUM1', actionName: 'Assess nutrient management', fieldIdx: 0, hectares: 24.5, paymentPerHa: 20, evidenceRequired: 'Nutrient management plan' },
  ];

  for (const a of sfiActions) {
    await prisma.sfiAction.create({
      data: {
        agreementId: sfi.id,
        actionCode: a.actionCode,
        actionName: a.actionName,
        fieldId: a.fieldIdx !== null ? fields[a.fieldIdx].id : null,
        hectares: a.hectares,
        paymentPerHa: a.paymentPerHa,
        evidenceRequired: a.evidenceRequired,
      },
    });
  }
  console.log('  ✅ SFI agreement + actions created');

  // ==================== RED TRACTOR AUDIT ====================
  const rtChecklist = await prisma.auditChecklist.create({
    data: {
      farmId: farm.id,
      scheme: 'red_tractor',
      auditDate: new Date('2025-09-15'),
      auditor: 'NSF International',
      status: 'prep',
    },
  });

  const rtItems = [
    { requirement: 'Spray records complete and up to date', category: 'Crop Protection', status: 'compliant' },
    { requirement: 'Sprayer tested (NSTS) within last 12 months', category: 'Crop Protection', status: 'compliant' },
    { requirement: 'Basis-qualified person advises on PPP use', category: 'Crop Protection', status: 'compliant' },
    { requirement: 'PPPs stored securely in locked, bunded store', category: 'Crop Protection', status: 'compliant' },
    { requirement: 'Medicine records complete with withdrawal periods', category: 'Livestock', status: 'compliant' },
    { requirement: 'All cattle identified with approved ear tags', category: 'Livestock', status: 'compliant' },
    { requirement: 'Cattle passports held for all animals', category: 'Livestock', status: 'pending' },
    { requirement: 'Movement records match BCMS', category: 'Livestock', status: 'pending' },
    { requirement: 'Feed supplier assurance documentation', category: 'Feed', status: 'compliant' },
    { requirement: 'Feed storage clean and pest-free', category: 'Feed', status: 'compliant' },
    { requirement: 'Water supply tested annually', category: 'Environment', status: 'non_compliant', notes: 'Water test due — last done Feb 2024' },
    { requirement: 'Nutrient management plan in place', category: 'Environment', status: 'compliant' },
    { requirement: 'Soil management plan in place', category: 'Environment', status: 'compliant' },
    { requirement: 'Waste management plan', category: 'Environment', status: 'pending' },
    { requirement: 'Health and safety risk assessment', category: 'Business', status: 'compliant' },
    { requirement: 'Staff training records', category: 'Business', status: 'compliant' },
    { requirement: 'Complaints procedure documented', category: 'Business', status: 'pending' },
    { requirement: 'Traceability — can trace all inputs and outputs', category: 'Business', status: 'compliant' },
  ];

  for (const item of rtItems) {
    await prisma.auditItem.create({
      data: { checklistId: rtChecklist.id, ...item },
    });
  }
  console.log('  ✅ Red Tractor audit checklist created');

  // ==================== COMPLIANCE ALERTS ====================
  const alerts = [
    { type: 'deadline', message: 'Red Tractor audit in 6 months — start preparation', dueDate: new Date('2025-09-15') },
    { type: 'expiry', message: 'Sprayer NSTS test expires in 2 months', dueDate: new Date('2025-05-15') },
    { type: 'deadline', message: 'SFI annual evidence submission due', dueDate: new Date('2025-12-31') },
    { type: 'missing_record', message: 'Water quality test overdue', dueDate: new Date('2025-02-01'), resolved: false },
    { type: 'deadline', message: 'NVZ closed period starts 1 Oct — plan last applications', dueDate: new Date('2025-10-01') },
    { type: 'expiry', message: '3 animals have medicine withdrawal periods ending this week', dueDate: new Date('2025-03-20') },
  ];

  for (const a of alerts) {
    await prisma.complianceAlert.create({
      data: { farmId: farm.id, ...a },
    });
  }
  console.log('  ✅ Compliance alerts created');

  // ==================== WEATHER STATION + READINGS ====================
  const station = await prisma.weatherStation.create({
    data: { farmId: farm.id, provider: 'metoffice', stationRef: 'SOMERSET-001', lat: 51.0255, lng: -3.1008 },
  });

  // Generate 30 days of readings
  for (let day = 0; day < 30; day++) {
    for (let hour = 0; hour < 24; hour += 3) {
      const date = new Date('2025-03-01');
      date.setDate(date.getDate() + day);
      date.setHours(hour, 0, 0, 0);
      await prisma.weatherReading.create({
        data: {
          stationId: station.id,
          timestamp: date,
          tempC: 3 + Math.sin((hour - 6) * Math.PI / 12) * 6 + Math.random() * 3 + day * 0.15,
          humidity: 60 + Math.random() * 30,
          windSpeed: 5 + Math.random() * 25,
          windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
          rainfallMm: Math.random() > 0.7 ? Math.random() * 4 : 0,
          pressureHpa: 1000 + Math.random() * 30,
        },
      });
    }
  }
  console.log('  ✅ Weather station + 240 readings created');

  // ==================== NOTIFICATIONS ====================
  const notifs = [
    { userId: james.id, type: 'warning', title: 'Withdrawal Period Active', message: '3 cattle have active medicine withdrawal periods. Check before any movements.', actionUrl: '/app/medicine' },
    { userId: james.id, type: 'deadline', title: 'BCMS Movement Due', message: 'Movement on 15/03 not yet submitted to BCMS. 3-day reporting rule.', actionUrl: '/app/movements' },
    { userId: james.id, type: 'info', title: 'SFI Payment Received', message: 'SFI quarterly payment of £2,112.50 received.', actionUrl: '/app/sfi' },
    { userId: james.id, type: 'warning', title: 'Sprayer Calibration Due', message: 'Hardi Commander 4400 — NSTS test expires in 60 days.', actionUrl: '/app/equipment' },
    { userId: james.id, type: 'deadline', title: 'Red Tractor Audit Prep', message: 'Annual Red Tractor audit scheduled for September. Start evidence gathering.', actionUrl: '/app/audit' },
    { userId: sarah.id, type: 'info', title: 'New Spray Record', message: 'James recorded a spray application on Top Meadow — Atlantis Star @ 0.8 l/ha.', actionUrl: '/app/spray' },
    { userId: sarah.id, type: 'deadline', title: 'NVZ Closed Period', message: 'NVZ closed period for manufactured fertiliser begins 15 September. Plan final applications.', actionUrl: '/app/fertiliser' },
    { userId: robert.id, type: 'info', title: 'Farm Access Granted', message: 'You now have read-only access to Oakfield Farm records.', actionUrl: '/app/dashboard' },
  ];

  for (const n of notifs) {
    await prisma.notification.create({ data: n });
  }
  console.log('  ✅ Notifications created');

  // ==================== VET CONTACTS ====================
  const vet1 = await prisma.vetContact.create({
    data: { farmId: farm.id, name: 'Sarah Williams', practice: 'Oakfield Veterinary Practice', phone: '01onal 555 123', email: 'sarah@oakfieldvets.co.uk', rcvsNumber: '7654321' },
  });
  const vet2 = await prisma.vetContact.create({
    data: { farmId: farm.id, name: 'Andrew Carter', practice: 'Oakfield Veterinary Practice', phone: '01onal 555 124', email: 'andrew@oakfieldvets.co.uk', rcvsNumber: '7654322' },
  });
  await prisma.vetContact.create({
    data: { farmId: farm.id, name: 'Emma Hughes', practice: 'Valley Vets', phone: '01823 555 200', email: 'emma@valleyvets.co.uk', rcvsNumber: '8901234' },
  });
  console.log('  ✅ 3 vet contacts created');

  // ==================== RECENT MEDICINE RECORDS (with active withdrawals) ====================
  const recentAnimals = await prisma.animal.findMany({ where: { farmId: farm.id, species: 'cattle', status: 'alive' }, take: 10 });
  if (recentAnimals.length >= 4) {
    // Record 1: Active withdrawal (treated 10 Mar 2026)
    const rec1 = await prisma.medicineRecord.create({
      data: {
        farmId: farm.id, date: new Date('2026-03-10'), productName: 'Pen & Strep Injectable',
        batchNumber: 'PS-2026-001', dose: '20ml', doseNumeric: 20, doseUnit: 'ml', route: 'injection',
        withdrawalMeatDays: 8, withdrawalMilkDays: 10,
        withdrawalEndMeat: new Date('2026-03-18'), withdrawalEndMilk: new Date('2026-03-20'),
        withdrawalEndDate: new Date('2026-03-20'),
        vetId: vet1.id, vetName: 'Sarah Williams', reason: 'Lameness — left hind foot',
        animalWeight: 280, isCourse: true, courseDoses: 3, courseIntervalHours: 48, courseCurrentDose: 2,
        notes: 'Moderate lameness grade 3/5. Responded well to first dose.',
      },
    });
    await prisma.animalMedicine.create({ data: { animalId: recentAnimals[0].id, medicineRecordId: rec1.id } });

    // Record 2: Active withdrawal (treated 8 Mar 2026)
    const rec2 = await prisma.medicineRecord.create({
      data: {
        farmId: farm.id, date: new Date('2026-03-08'), productName: 'Metacam 20mg/ml',
        batchNumber: 'MET-2026-002', dose: '15ml', doseNumeric: 15, doseUnit: 'ml', route: 'injection',
        withdrawalMeatDays: 15, withdrawalMilkDays: 5,
        withdrawalEndMeat: new Date('2026-03-23'), withdrawalEndMilk: new Date('2026-03-13'),
        withdrawalEndDate: new Date('2026-03-23'),
        vetId: vet2.id, vetName: 'Andrew Carter', reason: 'Pneumonia',
        animalWeight: 350,
      },
    });
    await prisma.animalMedicine.create({ data: { animalId: recentAnimals[1].id, medicineRecordId: rec2.id } });

    // Record 3: Cleared (treated 1 Mar 2026, 10 day meat)
    const rec3 = await prisma.medicineRecord.create({
      data: {
        farmId: farm.id, date: new Date('2026-03-01'), productName: 'Dectomax Pour-On',
        batchNumber: 'DEC-2026-003', dose: '10ml each', doseNumeric: 10, doseUnit: 'ml', route: 'pour-on',
        withdrawalMeatDays: 35, withdrawalMilkDays: 0,
        withdrawalEndMeat: new Date('2026-04-05'), withdrawalEndMilk: null,
        withdrawalEndDate: new Date('2026-04-05'),
        vetName: 'Sarah Williams', vetId: vet1.id, reason: 'Spring worming',
      },
    });
    await prisma.animalMedicine.create({ data: { animalId: recentAnimals[2].id, medicineRecordId: rec3.id } });
    await prisma.animalMedicine.create({ data: { animalId: recentAnimals[3].id, medicineRecordId: rec3.id } });

    console.log('  ✅ 3 recent medicine records (2 with active withdrawal) created');
  }

  // ==================== NUTRIENT PLANS ====================
  for (const field of fields.slice(0, 5)) {
    await prisma.nutrientPlan.create({
      data: {
        farmId: farm.id,
        fieldId: field.id,
        year: 2025,
        plannedN: 220,
        plannedP: 40,
        plannedK: 60,
        actualN: field.nvzZone ? 180 : 150,
        actualP: 36,
        actualK: 55,
        nvzCompliant: true,
      },
    });
  }
  console.log('  ✅ Nutrient plans created');

  console.log('\n🌱 Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
