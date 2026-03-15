import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// UK names for engineers and customers
const engineerNames = [
  'James Mitchell', 'Tom Harrison', 'Michael Davies', 'Chris Thompson', 'David Wilson',
  'Robert Brown', 'Paul Anderson', 'Mark Taylor', 'Steven Smith', 'Andrew Jones',
  'Peter Williams', 'John Roberts', 'Simon Clarke', 'Matthew Evans', 'Daniel Martin',
  'Gary White', 'Kevin Wright', 'Ryan Scott', 'Luke Green', 'Adam Baker'
];

const customerNames = [
  'Sarah Johnson', 'Emma Williams', 'Claire Davis', 'Lisa Taylor', 'Helen Brown',
  'Rachel Smith', 'Karen Anderson', 'Michelle Roberts', 'Amanda Wilson', 'Laura Martin',
  'Rebecca White', 'Victoria Green', 'Jennifer Clarke', 'Catherine Evans', 'Elizabeth Wright',
  'Margaret Scott', 'Janet Baker', 'Susan Thomas', 'Patricia Moore', 'Mary Robinson',
  'Linda Lewis', 'Barbara Walker', 'Dorothy Hall', 'Sandra Young', 'Ashley King',
  'Kimberly Hill', 'Donna Turner', 'Carol Adams', 'Ruth Campbell', 'Sharon Parker',
  'Michelle Edwards', 'Deborah Collins', 'Jessica Stewart', 'Cynthia Morris', 'Angela Rogers',
  'Shirley Cooper', 'Anna Hughes', 'Brenda Price', 'Pamela Bennett', 'Nicole Wood',
  'Samantha Barnes', 'Katherine Ross', 'Christine Henderson', 'Debra Coleman', 'Janet Jenkins',
  'Maria Perry', 'Heather Powell', 'Diane Long', 'Julie Patterson', 'Joyce Hughes'
];

const ukStreets = [
  'High Street', 'Station Road', 'Church Lane', 'Manor Drive', 'Park Avenue',
  'Victoria Road', 'Albert Street', 'Queen Street', 'King Street', 'Main Street',
  'Mill Lane', 'Chapel Road', 'Green Lane', 'School Lane', 'Bridge Street',
  'Market Street', 'London Road', 'Oak Avenue', 'The Green', 'Grove Road',
  'York Road', 'Richmond Avenue', 'Windsor Close', 'Cambridge Drive', 'Oxford Road',
  'Elm Grove', 'Ash Close', 'Beech Avenue', 'Cedar Road', 'Pine Street'
];

const ukPostcodes = [
  'SW1A 1AA', 'E1 6AN', 'WC2N 5DU', 'EC1A 1BB', 'N1 9AG', 'SE1 9SG', 'W1A 1AA',
  'NW1 6XE', 'SW7 2AZ', 'E14 5AB', 'CR0 1XT', 'BR1 1JT', 'DA1 1RT', 'KT1 1PE',
  'TW1 3QS', 'UB1 3BB', 'HA0 1HJ', 'EN1 1TX', 'IG1 1XY', 'RM1 3BD',
  'CM1 1PT', 'SS1 2HD', 'CO1 1RB', 'IP1 3AB', 'NR1 1RE', 'PE1 1XX', 'CB1 2JD',
  'LU1 2AA', 'AL1 2RJ', 'HP1 1AA', 'SL1 1XY', 'OX1 1AA', 'RG1 1AB', 'GU1 1AA',
  'SO14 7DY', 'PO1 3AX', 'BN1 1UB', 'BH1 1AA', 'DT1 1AA', 'BA1 1AA',
  'BS1 4DJ', 'GL1 2AN', 'TA1 3PX', 'TQ1 1AA', 'PL1 1AA', 'TR1 1AA', 'EX1 1AA',
  'CF10 1AA', 'SA1 1AA', 'LL57 1AA', 'SY1 1AA'
];

const companyNames = [
  'Thames Property Management', 'London Lettings Ltd', 'ABC Facilities', 'National Housing Trust',
  'Premier Property Services', 'City Commercial', 'Riverside Estates', 'Crown Property Group',
  'Metropolitan Housing', 'Sterling Real Estate', 'Windsor Property Co', 'Olympic Estates',
  'Jubilee Property Management', 'Victoria Housing', 'Nelson Properties', 'Churchill Estates',
  'Blake & Partners Property', 'Turner Commercial', 'Westminster Property Services', 'Camden Lettings'
];

const jobDescriptions = [
  'Boiler service and safety inspection',
  'Central heating system repair - no heating upstairs',
  'Leaking radiator valve replacement',
  'New boiler installation - Worcester Bosch 30kW',
  'Gas safety certificate (CP12) inspection',
  'Emergency gas leak - unsafe appliance',
  'Power tripping - electrical fault finding',
  'Consumer unit upgrade to 18th edition',
  'Full electrical inspection (EICR)',
  'Additional sockets in kitchen and bedroom',
  'Outdoor power supply for shed',
  'Electric shower installation',
  'LED downlight installation - living room',
  'Fault finding - lights not working in hallway',
  'Smoke alarm installation (10 year battery)',
  'Full rewire - 3-bed house',
  'HVAC service - commercial unit',
  'Air conditioning installation - 2 split units',
  'Ventilation system repair - office building',
  'F-Gas leak detection and repair',
  'Emergency plumbing - burst pipe',
  'New bathroom suite installation',
  'Kitchen tap replacement',
  'Toilet cistern repair - won\'t stop running',
  'Unblocking drains - kitchen sink',
  'Outside tap installation',
  'Power flush central heating system',
  'Thermostatic radiator valves (TRVs) installation',
  'Nest thermostat installation and setup',
  'Emergency callout - no hot water'
];

async function main() {
  console.log('🌱 Seeding TradeFlow database...');

  // Clear existing data in reverse dependency order
  await prisma.jobTimeline.deleteMany();
  await prisma.jobMaterial.deleteMany();
  await prisma.jobEngineer.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.quoteItem.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.job.deleteMany();
  await prisma.property.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.cisRecord.deleteMany();
  await prisma.engineer.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.companyUser.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.contactSubmission.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('demo1234', 12);

  console.log('Creating users...');
  
  // ==================== USERS ====================
  const admin = await prisma.user.create({
    data: { 
      email: 'admin@tradeflow.co.uk', 
      name: 'Admin User', 
      passwordHash, 
      role: 'ADMIN',
      phone: '020 7946 0958'
    },
  });

  const manager = await prisma.user.create({
    data: { 
      email: 'manager@tradeflow.co.uk', 
      name: 'Sarah Mitchell', 
      passwordHash, 
      role: 'MANAGER',
      phone: '020 7946 0959'
    },
  });

  const office = await prisma.user.create({
    data: { 
      email: 'office@tradeflow.co.uk', 
      name: 'Emma Thompson', 
      passwordHash, 
      role: 'OFFICE',
      phone: '020 7946 0960'
    },
  });

  // Engineer users (first 5 engineers get login accounts)
  const engineerUsers: any[] = [];
  for (let i = 0; i < 5; i++) {
    const user = await prisma.user.create({
      data: {
        email: `engineer${i + 1}@tradeflow.co.uk`,
        name: engineerNames[i],
        passwordHash,
        role: 'ENGINEER',
        phone: `07700 90${String(i).padStart(4, '0')}`
      }
    });
    engineerUsers.push(user);
  }

  console.log('Creating company...');
  
  // ==================== COMPANY ====================
  const company = await prisma.company.create({
    data: {
      name: 'TradeFlow Services Ltd',
      tradingName: 'TradeFlow',
      companyNumber: '12345678',
      vatNumber: 'GB123456789',
      address: '123 Commercial Road, London',
      postcode: 'E1 1AA',
      phone: '020 7946 0958',
      email: 'info@tradeflow.co.uk',
      website: 'https://tradeflow.co.uk',
      gasSafeNumber: 'GS123456',
      niceicNumber: 'NIC654321',
      fgasNumber: 'FGAS987654',
      cisRegistered: true,
      utrnumber: '1234567890'
    },
  });

  // Company users
  await prisma.companyUser.createMany({
    data: [
      { userId: admin.id, companyId: company.id, role: 'ADMIN' },
      { userId: manager.id, companyId: company.id, role: 'MANAGER' },
      { userId: office.id, companyId: company.id, role: 'OFFICE' },
    ],
  });

  console.log('Creating fleet vehicles...');
  
  // ==================== VEHICLES ====================
  const vehicles: any[] = [];
  const vehicleData = [
    { reg: 'VX65 ABC', make: 'Ford', model: 'Transit Custom', year: 2015, colour: 'White', fuelType: 'diesel' },
    { reg: 'VJ18 XYZ', make: 'Ford', model: 'Transit Custom', year: 2018, colour: 'White', fuelType: 'diesel' },
    { reg: 'VK21 DEF', make: 'Ford', model: 'Transit Custom', year: 2021, colour: 'White', fuelType: 'diesel' },
    { reg: 'VL23 GHI', make: 'Ford', model: 'Transit', year: 2023, colour: 'White', fuelType: 'diesel' },
    { reg: 'VM19 JKL', make: 'Vauxhall', model: 'Vivaro', year: 2019, colour: 'White', fuelType: 'diesel' },
    { reg: 'VN20 MNO', make: 'Vauxhall', model: 'Vivaro', year: 2020, colour: 'White', fuelType: 'diesel' },
    { reg: 'VP22 PQR', make: 'Mercedes', model: 'Sprinter', year: 2022, colour: 'Silver', fuelType: 'diesel' },
    { reg: 'VR23 STU', make: 'Mercedes', model: 'Vito', year: 2023, colour: 'White', fuelType: 'diesel' },
    { reg: 'VS24 VWX', make: 'Ford', model: 'Transit Custom', year: 2024, colour: 'White', fuelType: 'diesel' },
    { reg: 'VT24 YZA', make: 'Vauxhall', model: 'Combo', year: 2024, colour: 'White', fuelType: 'diesel' },
  ];

  for (const v of vehicleData) {
    const motExpiry = new Date();
    motExpiry.setFullYear(motExpiry.getFullYear() + 1);
    const taxExpiry = new Date();
    taxExpiry.setMonth(taxExpiry.getMonth() + 6);
    const insuranceExpiry = new Date();
    insuranceExpiry.setMonth(insuranceExpiry.getMonth() + 3);

    const vehicle = await prisma.vehicle.create({
      data: {
        companyId: company.id,
        registration: v.reg,
        make: v.make,
        model: v.model,
        year: v.year,
        colour: v.colour,
        fuelType: v.fuelType,
        motExpiry,
        taxExpiry,
        insuranceExpiry,
        vehicleType: 'van',
        currentKm: Math.floor(Math.random() * 50000) + 10000
      }
    });
    vehicles.push(vehicle);
  }

  console.log('Creating engineers...');
  
  // ==================== ENGINEERS ====================
  const engineers: any[] = [];
  const trades = ['plumbing', 'heating', 'electrical', 'multi'];
  const cisStatuses = ['gross', '20', '30'];

  for (let i = 0; i < 20; i++) {
    const name = engineerNames[i];
    const gasSafe = i % 3 === 0; // 1 in 3 engineers is Gas Safe
    const niceic = i % 2 === 0;   // 1 in 2 is NICEIC
    const fgas = i % 4 === 0;     // 1 in 4 has F-Gas

    const gasSafeExpiry = gasSafe ? new Date(2026, 11, 31) : null;
    const niceicExpiry = niceic ? new Date(2027, 2, 31) : null;
    const fgasExpiry = fgas ? new Date(2027, 6, 30) : null;
    const cscsExpiry = new Date(2027, 11, 31);
    const dvlaExpiry = new Date(2028 + Math.floor(i / 5), 3, 15);

    const engineer = await prisma.engineer.create({
      data: {
        companyId: company.id,
        userId: i < 5 ? engineerUsers[i].id : null,
        name,
        email: `${name.toLowerCase().replace(' ', '.')}@tradeflow.co.uk`,
        phone: `020 7946 ${String(1000 + i).padStart(4, '0')}`,
        mobile: `07700 90${String(1000 + i).padStart(4, '0')}`,
        employeeNumber: `ENG${String(i + 1).padStart(4, '0')}`,
        gasSafeNumber: gasSafe ? `GS${100000 + i}` : null,
        gasSafeExpiry,
        niceicCard: niceic ? `NIC${200000 + i}` : null,
        niceicExpiry,
        fgasNumber: fgas ? `FGAS${300000 + i}` : null,
        fgasExpiry,
        cscsCard: `CSCS${400000 + i}`,
        cscsExpiry,
        drivingLicence: `MITCH${String(i).padStart(6, '0')}`,
        dvlaExpiry,
        cisTaxStatus: cisStatuses[i % 3],
        cisVerificationRef: `CIS${500000 + i}`,
        niNumber: `AB${String(12345 + i).padStart(6, '0')}C`,
        hourlyRate: 35 + (i * 2.5),
        status: i < 18 ? 'active' : (i === 18 ? 'holiday' : 'sick'),
        vehicleId: i < vehicles.length ? vehicles[i].id : null,
        skills: JSON.stringify(gasSafe && niceic ? ['plumbing', 'heating', 'electrical'] : 
                               gasSafe ? ['plumbing', 'heating'] : 
                               niceic ? ['electrical'] : 
                               ['plumbing'])
      }
    });
    engineers.push(engineer);
  }

  console.log('Creating customers...');
  
  // ==================== CUSTOMERS ====================
  const customers: any[] = [];
  
  for (let i = 0; i < 60; i++) {
    const isCommercial = i % 4 === 0; // 25% commercial
    const customer = await prisma.customer.create({
      data: {
        companyId: company.id,
        name: isCommercial ? companyNames[i % companyNames.length] : customerNames[i % customerNames.length],
        company: isCommercial ? companyNames[i % companyNames.length] : null,
        email: isCommercial 
          ? `info@${companyNames[i % companyNames.length].toLowerCase().replace(/ /g, '')}.co.uk`
          : `${customerNames[i % customerNames.length].toLowerCase().replace(' ', '.')}@gmail.com`,
        phone: `020 7946 ${String(2000 + i).padStart(4, '0')}`,
        mobile: isCommercial ? null : `07700 ${String(800000 + i).padStart(6, '0')}`,
        address: `${10 + (i * 3)} ${ukStreets[i % ukStreets.length]}`,
        postcode: ukPostcodes[i % ukPostcodes.length],
        accountNumber: `CUST${String(1000 + i).padStart(6, '0')}`,
        propertyType: isCommercial ? 'commercial' : (i % 5 === 0 ? 'landlord' : 'residential'),
        paymentTerms: isCommercial ? '30_days' : 'cash',
        notes: isCommercial ? 'Net 30 days payment terms. Invoice to accounts department.' : null
      }
    });
    customers.push(customer);
  }

  console.log('Creating properties...');
  
  // ==================== PROPERTIES ====================
  const properties: any[] = [];
  
  // Each customer gets 1-3 properties (landlords get more)
  for (const customer of customers) {
    const isLandlord = customer.propertyType === 'landlord';
    const propertyCount = isLandlord ? 5 + Math.floor(Math.random() * 10) : 1;

    for (let p = 0; p < propertyCount; p++) {
      const property = await prisma.property.create({
        data: {
          customerId: customer.id,
          address: `${10 + (p * 2)} ${ukStreets[(customers.indexOf(customer) + p) % ukStreets.length]}`,
          postcode: ukPostcodes[(customers.indexOf(customer) + p) % ukPostcodes.length],
          propertyType: isLandlord ? (p % 2 === 0 ? 'flat' : 'house') : customer.propertyType,
          accessNotes: isLandlord ? 'Key in office safe' : null,
          keyLocation: isLandlord ? `Keysafe code: ${1000 + p}` : null
        }
      });
      properties.push(property);
    }
  }

  console.log('Creating jobs...');
  
  // ==================== JOBS ====================
  const jobs: any[] = [];
  const jobTypes = ['install', 'repair', 'service', 'inspection', 'emergency'];
  const jobTrades = ['plumbing', 'heating', 'electrical', 'hvac'];
  const priorities = ['urgent', 'high', 'normal', 'low'];
  const statuses = ['scheduled', 'in_progress', 'completed', 'invoiced'];

  // Generate 120 jobs over the past 6 months
  for (let i = 0; i < 120; i++) {
    const property = properties[i % properties.length];
    const customer = customers.find(c => c.id === property.customerId)!;
    const jobType = jobTypes[i % jobTypes.length];
    const trade = jobTrades[i % jobTrades.length];
    const priority = i < 10 ? 'urgent' : priorities[i % priorities.length];
    
    // Most jobs are completed, some in progress, few scheduled
    let status = statuses[Math.floor(i / 30)];
    if (i >= 110) status = 'scheduled'; // Last 10 are upcoming
    if (i >= 100 && i < 110) status = 'in_progress'; // 10 in progress
    
    const daysAgo = 180 - Math.floor(i * 1.5);
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() - daysAgo);
    
    const completedDate = status === 'completed' || status === 'invoiced' 
      ? new Date(scheduledDate.getTime() + (2 + Math.random() * 5) * 24 * 60 * 60 * 1000)
      : null;

    const assignedEngineer = engineers[i % engineers.length];
    const duration = 1 + Math.random() * 4;
    const callout = jobType === 'emergency' ? 75 : 0;
    const labour = duration * assignedEngineer.hourlyRate!;
    const materials = Math.random() * 300;
    const total = callout + labour + materials;

    const job = await prisma.job.create({
      data: {
        companyId: company.id,
        customerId: customer.id,
        propertyId: property.id,
        jobNumber: `JOB${String(10000 + i).padStart(6, '0')}`,
        title: jobDescriptions[i % jobDescriptions.length],
        description: `${jobDescriptions[i % jobDescriptions.length]}. Customer ${customer.name}.`,
        jobType,
        trade,
        priority,
        status,
        scheduledDate,
        scheduledTime: `${8 + Math.floor(Math.random() * 8)}:00`,
        completedDate,
        assignedEngineerId: assignedEngineer.userId,
        estimatedDuration: duration,
        actualDuration: completedDate ? duration + (Math.random() - 0.5) : null,
        calloutCharge: callout,
        labourCost: labour,
        materialsCost: materials,
        totalCost: total,
        requiresCertificate: trade === 'heating' || trade === 'electrical',
        engineerNotes: completedDate ? 'Job completed successfully. Customer happy with work.' : null,
        internalNotes: priority === 'urgent' ? 'URGENT - Priority booking' : null
      }
    });
    jobs.push(job);

    // Link engineer to job
    await prisma.jobEngineer.create({
      data: {
        jobId: job.id,
        engineerId: assignedEngineer.id
      }
    });

    // Job timeline
    await prisma.jobTimeline.createMany({
      data: [
        { jobId: job.id, timestamp: scheduledDate, event: 'created', description: 'Job created by office' },
        { jobId: job.id, timestamp: scheduledDate, event: 'scheduled', description: `Assigned to ${assignedEngineer.name}` },
        ...(completedDate ? [
          { jobId: job.id, timestamp: new Date(scheduledDate.getTime() + 60 * 60 * 1000), event: 'started', description: 'Engineer arrived on site' },
          { jobId: job.id, timestamp: completedDate, event: 'completed', description: 'Work completed' }
        ] : [])
      ]
    });

    // Materials
    if (materials > 50) {
      const materialCount = 1 + Math.floor(Math.random() * 3);
      for (let m = 0; m < materialCount; m++) {
        await prisma.jobMaterial.create({
          data: {
            jobId: job.id,
            description: ['Boiler parts', 'Radiator valve', 'Copper pipe 22mm', 'MCB circuit breaker', 'LED downlights', 'Twin & earth cable'][m % 6],
            quantity: 1 + Math.floor(Math.random() * 5),
            unitPrice: 10 + Math.random() * 50,
            totalPrice: materials / materialCount,
            supplier: ['Plumb Center', 'City Plumbing', 'Screwfix', 'CEF', 'Edmundson'][m % 5]
          }
        });
      }
    }
  }

  console.log('Creating certificates...');
  
  // ==================== CERTIFICATES ====================
  let certCount = 0;
  for (const job of jobs) {
    if (job.requiresCertificate && job.status === 'completed') {
      const isGas = job.trade === 'heating';
      const isElectrical = job.trade === 'electrical';

      if (isGas && certCount < 60) {
        const issueDate = job.completedDate!;
        const expiryDate = new Date(issueDate);
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);

        await prisma.certificate.create({
          data: {
            companyId: company.id,
            jobId: job.id,
            engineerId: engineers.find(e => e.userId === job.assignedEngineerId)!.id,
            customerId: job.customerId,
            propertyId: job.propertyId!,
            certificateType: 'gas_safe_cp12',
            certificateNumber: `CP12-${String(100000 + certCount).padStart(8, '0')}`,
            issueDate,
            expiryDate,
            nextServiceDue: expiryDate,
            status: new Date() < expiryDate ? 'valid' : 'expired',
            pdfUrl: `/certificates/CP12-${certCount}.pdf`,
            details: JSON.stringify({
              appliances: ['Boiler', 'Gas Fire'],
              gasSafeEngineer: engineers.find(e => e.userId === job.assignedEngineerId)!.gasSafeNumber,
              testResults: 'All appliances safe'
            })
          }
        });
        certCount++;
      }

      if (isElectrical && certCount < 40) {
        const issueDate = job.completedDate!;
        const expiryDate = new Date(issueDate);
        expiryDate.setFullYear(expiryDate.getFullYear() + 5);

        await prisma.certificate.create({
          data: {
            companyId: company.id,
            jobId: job.id,
            engineerId: engineers.find(e => e.userId === job.assignedEngineerId)!.id,
            customerId: job.customerId,
            propertyId: job.propertyId!,
            certificateType: 'niceic_eicr',
            certificateNumber: `EICR-${String(200000 + certCount).padStart(8, '0')}`,
            issueDate,
            expiryDate,
            status: new Date() < expiryDate ? 'valid' : 'expired',
            pdfUrl: `/certificates/EICR-${certCount}.pdf`,
            details: JSON.stringify({
              recommendation: 'Satisfactory',
              niceicEngineer: engineers.find(e => e.userId === job.assignedEngineerId)!.niceicCard,
              observations: 'Minor improvement recommended - add RCD protection'
            })
          }
        });
        certCount++;
      }
    }
  }

  console.log('Creating invoices...');
  
  // ==================== INVOICES ====================
  const invoices: any[] = [];
  let invoiceNum = 1;

  for (const job of jobs) {
    if (job.status === 'invoiced' || (job.status === 'completed' && Math.random() > 0.3)) {
      const dueDate = new Date(job.completedDate!);
      dueDate.setDate(dueDate.getDate() + 30);

      const customer = customers.find(c => c.id === job.customerId)!;
      const isCis = customer.propertyType === 'commercial' && Math.random() > 0.5;
      const cisRate = isCis ? (Math.random() > 0.5 ? 20 : 30) : 0;

      const subtotal = job.totalCost!;
      const vat = subtotal * 0.2;
      const total = subtotal + vat;
      const cisDeduction = isCis ? (subtotal * cisRate / 100) : 0;
      const netPayable = total - cisDeduction;

      const isPaid = Math.random() > 0.3;
      const paidDate = isPaid ? new Date(dueDate.getTime() - Math.random() * 10 * 24 * 60 * 60 * 1000) : null;

      const invoice = await prisma.invoice.create({
        data: {
          companyId: company.id,
          customerId: customer.id,
          invoiceNumber: `INV${String(invoiceNum).padStart(6, '0')}`,
          title: job.title,
          date: job.completedDate!,
          dueDate,
          subtotal,
          vat,
          total,
          cisDeduction: cisDeduction || null,
          cisRate: cisRate || null,
          netPayable: isCis ? netPayable : null,
          status: isPaid ? 'paid' : (new Date() > dueDate ? 'overdue' : 'unpaid'),
          paidAmount: isPaid ? netPayable : null,
          paidDate,
          paymentMethod: isPaid ? (Math.random() > 0.5 ? 'bank_transfer' : 'card') : null,
          notes: isCis ? `CIS deduction ${cisRate}% applied` : null
        }
      });
      invoices.push(invoice);
      invoiceNum++;

      // Invoice items
      await prisma.invoiceItem.createMany({
        data: [
          { 
            invoiceId: invoice.id, 
            description: 'Labour', 
            quantity: job.actualDuration!, 
            unitPrice: job.labourCost! / job.actualDuration!,
            totalPrice: job.labourCost!
          },
          ...(job.materialsCost! > 0 ? [{
            invoiceId: invoice.id,
            description: 'Materials and parts',
            quantity: 1,
            unitPrice: job.materialsCost!,
            totalPrice: job.materialsCost!
          }] : []),
          ...(job.calloutCharge! > 0 ? [{
            invoiceId: invoice.id,
            description: 'Emergency callout charge',
            quantity: 1,
            unitPrice: job.calloutCharge!,
            totalPrice: job.calloutCharge!
          }] : [])
        ]
      });

      // Update job with invoice link
      await prisma.job.update({
        where: { id: job.id },
        data: { invoiceId: invoice.id, status: 'invoiced' }
      });
    }
  }

  console.log('Creating CIS records...');
  
  // ==================== CIS RECORDS ====================
  // Monthly CIS records for subcontractors
  const months = ['2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03'];
  
  for (const month of months) {
    for (const engineer of engineers) {
      if (engineer.cisTaxStatus === '20' || engineer.cisTaxStatus === '30') {
        const gross = 2000 + Math.random() * 3000;
        const rate = parseFloat(engineer.cisTaxStatus);
        const deduction = gross * rate / 100;
        const net = gross - deduction;

        await prisma.cisRecord.create({
          data: {
            companyId: company.id,
            engineerId: engineer.id,
            monthYear: month,
            grossPayment: gross,
            cisRate: rate,
            cisDeduction: deduction,
            netPayment: net,
            hmrcSubmitted: month !== '2026-03', // Current month not submitted yet
            hmrcSubmittedDate: month !== '2026-03' ? new Date(`${month}-15`) : null,
            hmrcReference: month !== '2026-03' ? `HMRC${month.replace('-', '')}${engineer.id.slice(0, 4)}` : null
          }
        });
      }
    }
  }

  console.log('Creating quotes...');
  
  // ==================== QUOTES ====================
  // 30 quotes (some accepted → became jobs, some pending, some rejected)
  for (let i = 0; i < 30; i++) {
    const customer = customers[i % customers.length];
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30 - Math.floor(Math.random() * 60));

    const items = 1 + Math.floor(Math.random() * 3);
    let subtotal = 0;
    const quoteItems: any[] = [];

    for (let item = 0; item < items; item++) {
      const qty = 1 + Math.floor(Math.random() * 3);
      const price = 50 + Math.random() * 500;
      const total = qty * price;
      subtotal += total;
      quoteItems.push({
        description: ['New boiler installation', 'Full rewire', 'Bathroom suite replacement', 'Kitchen plumbing'][item % 4],
        quantity: qty,
        unitPrice: price,
        totalPrice: total
      });
    }

    const vat = subtotal * 0.2;
    const total = subtotal + vat;

    const status = i < 15 ? 'accepted' : (i < 22 ? 'sent' : (i < 28 ? 'pending' : 'rejected'));

    const quote = await prisma.quote.create({
      data: {
        companyId: company.id,
        customerId: customer.id,
        quoteNumber: `QT${String(1000 + i).padStart(6, '0')}`,
        title: `Quote for ${customer.name}`,
        description: quoteItems.map(q => q.description).join(', '),
        validUntil,
        subtotal,
        vat,
        total,
        status
      }
    });

    for (const item of quoteItems) {
      await prisma.quoteItem.create({
        data: {
          quoteId: quote.id,
          ...item
        }
      });
    }
  }

  console.log('Creating notifications...');
  
  // ==================== NOTIFICATIONS ====================
  await prisma.notification.createMany({
    data: [
      {
        userId: admin.id,
        type: 'warning',
        title: 'Gas Safe Certificate Expiring',
        message: 'James Mitchell - Gas Safe certificate expires in 30 days',
        read: false,
        actionUrl: `/engineers/${engineers[0].id}`
      },
      {
        userId: admin.id,
        type: 'warning',
        title: 'MOT Due',
        message: `Vehicle ${vehicles[0].registration} MOT expires in 14 days`,
        read: false,
        actionUrl: `/fleet/${vehicles[0].id}`
      },
      {
        userId: admin.id,
        type: 'info',
        title: 'Invoice Paid',
        message: `Invoice INV000123 has been paid - £${invoices[0]?.total?.toFixed(2) || '0.00'}`,
        read: true
      },
      {
        userId: manager.id,
        type: 'deadline',
        title: 'CIS Submission Due',
        message: 'Monthly CIS return due by 19th March 2026',
        read: false,
        actionUrl: '/cis'
      }
    ]
  });

  console.log('Creating contact submissions...');
  
  // ==================== CONTACT SUBMISSIONS ====================
  await prisma.contactSubmission.createMany({
    data: [
      {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '07700 900123',
        message: 'Looking for a reliable plumber for ongoing work in my property portfolio',
        source: 'google',
        medium: 'cpc',
        device: 'mobile'
      },
      {
        name: 'ABC Property Ltd',
        email: 'enquiries@abcproperty.co.uk',
        phone: '020 7946 1234',
        company: 'ABC Property Ltd',
        message: 'Need annual gas safety certificates for 50 properties',
        source: 'google',
        medium: 'organic',
        device: 'desktop'
      }
    ]
  });

  console.log('✅ Seeding complete!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`- ${await prisma.user.count()} Users`);
  console.log(`- ${await prisma.engineer.count()} Engineers`);
  console.log(`- ${await prisma.customer.count()} Customers`);
  console.log(`- ${await prisma.property.count()} Properties`);
  console.log(`- ${await prisma.job.count()} Jobs`);
  console.log(`- ${await prisma.certificate.count()} Certificates`);
  console.log(`- ${await prisma.invoice.count()} Invoices`);
  console.log(`- ${await prisma.quote.count()} Quotes`);
  console.log(`- ${await prisma.vehicle.count()} Vehicles`);
  console.log(`- ${await prisma.cisRecord.count()} CIS Records`);
  console.log('');
  console.log('🔐 Login credentials:');
  console.log('Email: admin@tradeflow.co.uk');
  console.log('Password: demo1234');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
