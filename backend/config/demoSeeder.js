const bcrypt = require('bcrypt');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Checkup = require('../models/Checkup');
const Room = require('../models/Room');
const Announcement = require('../models/Announcement');

const seedDemoData = async () => {
  try {
    console.log('--- Starting Demo Data Seeding (Through December 2026) ---');

    // 1. Recreate Demo Users across all roles
    const salt = await bcrypt.genSalt(10);
    const demoPassword = await bcrypt.hash('password123', salt);

    const demoEmails = [
      'demo.admin@medilink.com',
      'demo.nurse@medilink.com',
      'demo.doctor@medilink.com',
      'house.doctor@medilink.com',
      'grey.doctor@medilink.com',
      'extra.nurse@medilink.com'
    ];
    await User.deleteMany({ email: { $in: demoEmails } });

    const adminUser = new User({
      name: 'Demo Admin/Receptionist',
      email: 'demo.admin@medilink.com',
      password: demoPassword,
      role: 'admin/receptionist'
    });

    const nurseUser = new User({
      name: 'Demo Nurse Sarah',
      email: 'demo.nurse@medilink.com',
      password: demoPassword,
      role: 'nurse'
    });

    const doctorUser = new User({
      name: 'Dr. Alexander Pierce',
      email: 'demo.doctor@medilink.com',
      password: demoPassword,
      role: 'doctor'
    });

    const docHouse = new User({
      name: 'Dr. Gregory House',
      email: 'house.doctor@medilink.com',
      password: demoPassword,
      role: 'doctor'
    });

    const docGrey = new User({
      name: 'Dr. Meredith Grey',
      email: 'grey.doctor@medilink.com',
      password: demoPassword,
      role: 'doctor'
    });

    const nurseJohn = new User({
      name: 'Nurse John Watson',
      email: 'extra.nurse@medilink.com',
      password: demoPassword,
      role: 'nurse'
    });

    await Promise.all([
      adminUser.save(),
      nurseUser.save(),
      doctorUser.save(),
      docHouse.save(),
      docGrey.save(),
      nurseJohn.save()
    ]);
    console.log('Demo user accounts seeded for all roles.');

    // 2. Clear collections for pristine demo state
    await Patient.deleteMany({});
    await Appointment.deleteMany({});
    await Checkup.deleteMany({});
    await Announcement.deleteMany({});
    await Room.deleteMany({});
    console.log('Collections cleared.');

    // 3. Seed Rooms
    const roomsToSeed = [];
    for (let i = 1; i <= 20; i++) {
      roomsToSeed.push({
        name: `Room ${i}`,
        roomNumber: i,
        status: i % 4 === 0 ? 'Occupied' : 'Available'
      });
    }
    const seededRooms = await Room.insertMany(roomsToSeed);
    console.log(`${seededRooms.length} rooms seeded.`);

    // 4. Seed Patients with Checkup Vitals
    const patientData = [
      {
        nik: '3171012345670001',
        name: 'John Doe',
        gender: 'Male',
        birthdate: new Date('1985-04-12'),
        bloodType: 'A+',
        contact: '081234567890',
        address: 'Sudirman St. No. 45, Jakarta',
        medicalHistory: 'Allergy to Penicillin, mild asthma',
        checkups: [
          {
            date: new Date(Date.now() - 1000 * 60 * 60 * 3),
            temperature: '36.7',
            bloodPressure: '120/80',
            heartRate: '72',
            weight: '75',
            height: '178',
            notes: 'Patient feels slight dizziness but otherwise stable.'
          }
        ]
      },
      {
        nik: '3171012345670002',
        name: 'Jane Smith',
        gender: 'Female',
        birthdate: new Date('1992-09-22'),
        bloodType: 'O-',
        contact: '081298765432',
        address: 'Gatot Subroto St. No. 12, Jakarta',
        medicalHistory: 'Migraine history, lactose intolerance',
        checkups: [
          {
            date: new Date(Date.now() - 1000 * 60 * 60 * 2),
            temperature: '36.9',
            bloodPressure: '115/75',
            heartRate: '76',
            weight: '58',
            height: '165',
            notes: 'Complaining of tension headaches after long work hours.'
          }
        ]
      },
      {
        nik: '3171012345670003',
        name: 'Robert Downey',
        gender: 'Male',
        birthdate: new Date('1970-12-05'),
        bloodType: 'B+',
        contact: '08111222333',
        address: 'Kemang Raya No. 8, Jakarta',
        medicalHistory: 'Hypertension, high cholesterol',
        checkups: [
          {
            date: new Date(Date.now() - 1000 * 60 * 60 * 4),
            temperature: '37.2',
            bloodPressure: '140/90',
            heartRate: '85',
            weight: '82',
            height: '175',
            notes: 'Elevated blood pressure. Complaining of mild tension headaches.'
          }
        ]
      },
      {
        nik: '3171012345670004',
        name: 'Emily Watson',
        gender: 'Female',
        birthdate: new Date('1988-07-19'),
        bloodType: 'AB+',
        contact: '081344556677',
        address: 'Menteng Indah No. 2, Jakarta',
        medicalHistory: 'Type 2 Diabetes',
        checkups: [
          {
            date: new Date(Date.now() - 1000 * 60 * 60 * 5),
            temperature: '36.6',
            bloodPressure: '122/82',
            heartRate: '78',
            weight: '64',
            height: '168',
            notes: 'Fasting glucose levels regular. Scheduled routine review.'
          }
        ]
      },
      {
        nik: '3171012345670005',
        name: 'Michael Scott',
        gender: 'Male',
        birthdate: new Date('1965-03-15'),
        bloodType: 'O+',
        contact: '081555666777',
        address: 'Slipi Jaya St. No. 10, Jakarta',
        medicalHistory: 'High Cholesterol, stress fatigue',
        checkups: []
      },
      {
        nik: '3171012345670006',
        name: 'Sarah Connor',
        gender: 'Female',
        birthdate: new Date('1980-11-30'),
        bloodType: 'A-',
        contact: '081999888777',
        address: 'Rasuna Said St. Block C, Jakarta',
        medicalHistory: 'Post-traumatic stress disorder, physical trauma history',
        checkups: []
      }
    ];

    const seededPatients = await Patient.insertMany(patientData);
    console.log(`${seededPatients.length} dummy patients seeded.`);

    // 5. Seed Announcements (Admin Role) up through Dec 2026
    const announcementData = [
      {
        content: 'System maintenance scheduled for Sunday, December 13th, 2026 at 22:00 UTC. All clinic workstations will undergo regular updates.',
        urgency: true,
        author: adminUser._id.toString(),
        createdAt: new Date('2026-12-01T10:00:00Z')
      },
      {
        content: 'Q4 2026 Medical Equipment delivery completed for Room 3 and Room 4. Staff orientation scheduled for next Tuesday morning.',
        urgency: false,
        author: adminUser._id.toString(),
        createdAt: new Date('2026-10-15T09:00:00Z')
      },
      {
        content: 'Annual Healthcare & AI Diagnostics Refresher Workshop set for November 2026. All medical personnel are encouraged to participate.',
        urgency: false,
        author: adminUser._id.toString(),
        createdAt: new Date('2026-08-20T14:30:00Z')
      }
    ];
    await Announcement.insertMany(announcementData);
    console.log('Announcements through Dec 2026 seeded.');

    // 6. Seed Appointments from past through DECEMBER 2026 (All Roles)
    const appts = [];
    const doctors = [doctorUser, docHouse, docGrey];

    // Today's active appointments
    const today = new Date();

    appts.push({
      patient: seededPatients[0]._id,
      doctor: doctorUser._id,
      dateTime: new Date(today.setHours(9, 0, 0, 0)),
      notes: 'Monthly blood pressure & vitals review.',
      checkups: [seededPatients[0].checkups[0]]
    });

    appts.push({
      patient: seededPatients[1]._id,
      doctor: docHouse._id,
      dateTime: new Date(today.setHours(11, 30, 0, 0)),
      notes: 'Consultation regarding persistent leg pain.',
      checkups: [seededPatients[1].checkups[0]]
    });

    appts.push({
      patient: seededPatients[2]._id,
      doctor: docGrey._id,
      dateTime: new Date(today.setHours(14, 0, 0, 0)),
      notes: 'Cardiac follow-up checkup.',
      checkups: [seededPatients[2].checkups[0]]
    });

    appts.push({
      patient: seededPatients[3]._id,
      doctor: doctorUser._id,
      dateTime: new Date(today.setHours(16, 30, 0, 0)),
      notes: 'Diabetes glucose monitoring & AI evaluation.',
      checkups: [seededPatients[3].checkups[0]]
    });

    // Populate Historical Appointments (Past 6 months up to current date)
    for (let monthOffset = 1; monthOffset <= 6; monthOffset++) {
      const targetMonthDate = new Date();
      targetMonthDate.setMonth(today.getMonth() - monthOffset);

      const countToSeed = 10 + (monthOffset * 2);
      for (let j = 0; j < countToSeed; j++) {
        const randomPatient = seededPatients[j % seededPatients.length];
        const randomDoctor = doctors[j % doctors.length];
        const apptDate = new Date(targetMonthDate);
        apptDate.setDate(Math.max(1, Math.min(28, j * 2 + 1)));
        apptDate.setHours(9 + (j % 5), 0, 0, 0);

        appts.push({
          patient: randomPatient._id,
          doctor: randomDoctor._id,
          dateTime: apptDate,
          notes: `Historical clinical consultation record.`,
          checkups: []
        });
      }
    }

    // Populate Future Scheduled Appointments UP UNTIL DECEMBER 2026
    // Months: August 2026, September 2026, October 2026, November 2026, December 2026
    const futureMonths = [
      { year: 2026, month: 7, name: 'August 2026' },     // Month 7 = August (0-indexed)
      { year: 2026, month: 8, name: 'September 2026' },  // Month 8 = September
      { year: 2026, month: 9, name: 'October 2026' },    // Month 9 = October
      { year: 2026, month: 10, name: 'November 2026' },  // Month 10 = November
      { year: 2026, month: 11, name: 'December 2026' }   // Month 11 = December
    ];

    const upcomingNotes = [
      'Routine quarterly clinical checkup and vitals assessment.',
      'Cardiology follow-up and ECG screening.',
      'Endocrine glucose control review.',
      'Pulmonology evaluation for asthma management.',
      'General health wellness check & lab review.',
      'Post-treatment follow-up consultation.'
    ];

    futureMonths.forEach(({ year, month }, monthIdx) => {
      // Seed 6 to 10 scheduled appointments per month up to Dec 2026
      const apptCount = 8 + (monthIdx % 3);
      for (let k = 0; k < apptCount; k++) {
        const patientObj = seededPatients[k % seededPatients.length];
        const doctorObj = doctors[k % doctors.length];
        
        // Days spread across the month (1st through 28th)
        const dayOfMonth = Math.min(28, 2 + k * 3);
        const apptDate = new Date(year, month, dayOfMonth, 9 + (k % 6), 0, 0);

        appts.push({
          patient: patientObj._id,
          doctor: doctorObj._id,
          dateTime: apptDate,
          notes: upcomingNotes[k % upcomingNotes.length],
          checkups: []
        });
      }
    });

    const seededAppts = await Appointment.insertMany(appts);
    console.log(`${seededAppts.length} appointments seeded through December 2026.`);

    // 7. Seed Completed Doctor Checkups & AI Diagnoses (Spanning through December 2026)
    const checkupsData = [
      {
        patientId: seededPatients[0]._id,
        date: new Date('2026-06-15T10:30:00Z'),
        type: 'General Checkup',
        symptoms: 'Mild sore throat, low-grade fever, and runny nose',
        vitalSigns: {
          temperature: '37.8',
          bloodPressure: '118/78',
          heartRate: '80',
          weight: '74.5',
          height: '178'
        },
        details: 'Throat shows mild congestion, nasal mucosa swollen.',
        doctorNotes: 'Prescribed vitamin supplements, throat lozenges, and saline nasal spray.',
        aiResponse: {
          possibleDiagnoses: ['Common Cold', 'Mild Pharyngitis', 'Allergic Rhinitis'],
          recommendedActions: 'Hydrate well, rest, and use saline gargles.',
          riskFactors: ['Seasonal allergies'],
          followUpRecommendations: 'Follow up if symptoms do not improve within a week.',
          confidence: 90,
          confidenceExplanation: 'Typical symptom profile matches upper respiratory tract infection.',
          additionalConsiderations: 'Monitor for signs of secondary bacterial infection.',
          analyzedAt: new Date('2026-06-15T10:35:00Z'),
          aiModel: 'gemini-1.5-flash',
          analysisVersion: '1.0'
        }
      },
      {
        patientId: seededPatients[2]._id,
        date: new Date('2026-08-10T14:15:00Z'),
        type: 'Cardiology Clinic',
        symptoms: 'Shortness of breath on exertion, ankle swelling',
        vitalSigns: {
          temperature: '36.5',
          bloodPressure: '145/95',
          heartRate: '92',
          weight: '83',
          height: '175'
        },
        details: 'Trace pedal edema, heart rate regular but elevated. BP elevated.',
        doctorNotes: 'Adjusted hypertension medications. Recommended low sodium diet.',
        aiResponse: {
          possibleDiagnoses: ['Hypertensive Cardiovascular Disease', 'Early Congestive Heart Failure', 'Chronic Kidney Disease'],
          recommendedActions: 'Perform ECG, measure serum electrolytes, schedule echocardiogram.',
          riskFactors: ['Sedentary lifestyle', 'High sodium intake', 'Family history of CAD'],
          followUpRecommendations: 'Review in clinic in 2 weeks with ECG results.',
          confidence: 85,
          confidenceExplanation: 'Combination of trace edema, dyspnea, and hypertension points to fluid retention and high afterload.',
          additionalConsiderations: 'Monitor renal functions regularly.',
          analyzedAt: new Date('2026-08-10T14:20:00Z'),
          aiModel: 'gemini-1.5-flash',
          analysisVersion: '1.0'
        }
      },
      {
        patientId: seededPatients[3]._id,
        date: new Date('2026-10-05T11:00:00Z'),
        type: 'Endocrinology Consultation',
        symptoms: 'Mild fatigue, increased thirst, routine diabetes check',
        vitalSigns: {
          temperature: '36.6',
          bloodPressure: '124/80',
          heartRate: '75',
          weight: '64.5',
          height: '168'
        },
        details: 'HbA1c levels stable at 6.8%. No signs of peripheral neuropathy.',
        doctorNotes: 'Continued Metformin regimen. Advised maintaining daily physical activity.',
        aiResponse: {
          possibleDiagnoses: ['Controlled Type 2 Diabetes Mellitus', 'Mild Metabolic Fatigue'],
          recommendedActions: 'Maintain current medication dosage, monitor fasting blood glucose 3x weekly.',
          riskFactors: ['Dietary carbohydrate spikes', 'Sedentary work hours'],
          followUpRecommendations: 'Schedule follow-up HbA1c review in December 2026.',
          confidence: 92,
          confidenceExplanation: 'Glycemic metrics and vital signs indicate well-managed diabetic state.',
          additionalConsiderations: 'Screen for retinal and kidney microvascular health annually.',
          analyzedAt: new Date('2026-10-05T11:05:00Z'),
          aiModel: 'gemini-1.5-flash',
          analysisVersion: '1.0'
        }
      },
      {
        patientId: seededPatients[1]._id,
        date: new Date('2026-12-02T15:30:00Z'),
        type: 'Neurology Consultation',
        symptoms: 'Recurrent throbbing migraine, photophobia',
        vitalSigns: {
          temperature: '36.8',
          bloodPressure: '116/74',
          heartRate: '74',
          weight: '58.5',
          height: '165'
        },
        details: 'Neurological examination intact. No focal deficits.',
        doctorNotes: 'Prescribed triptan therapy for acute migraine episodes and stress management guidance.',
        aiResponse: {
          possibleDiagnoses: ['Migraine without Aura', 'Tension-Type Headache'],
          recommendedActions: 'Avoid trigger foods, maintain sleep hygiene, keep headache diary.',
          riskFactors: ['Screen time fatigue', 'Stress triggers'],
          followUpRecommendations: 'Follow up in 4 weeks or if headache frequency increases.',
          confidence: 88,
          confidenceExplanation: 'Unilateral throbbing pattern with photophobia aligns with classic migraine presentation.',
          additionalConsiderations: 'Rule out caffeine withdrawal or postural neck strain.',
          analyzedAt: new Date('2026-12-02T15:35:00Z'),
          aiModel: 'gemini-1.5-flash',
          analysisVersion: '1.0'
        }
      }
    ];

    const seededCheckups = await Checkup.insertMany(checkupsData);
    console.log(`${seededCheckups.length} completed doctor checkups & AI diagnoses seeded through December 2026.`);

    console.log('--- Demo Data Seeding Completed Successfully up through December 2026! 🌱 ---');
    return {
      adminId: adminUser._id,
      nurseId: nurseUser._id,
      doctorId: doctorUser._id
    };
  } catch (error) {
    console.error('Error during demo seeding:', error);
    throw error;
  }
};

module.exports = seedDemoData;
