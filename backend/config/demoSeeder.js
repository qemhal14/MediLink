const bcrypt = require('bcrypt');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Checkup = require('../models/Checkup');
const Room = require('../models/Room');
const Announcement = require('../models/Announcement');

const seedDemoData = async () => {
  try {
    console.log('--- Starting Demo Data Seeding ---');

    // 1. Recreate Demo Users
    const salt = await bcrypt.genSalt(10);
    const demoPassword = await bcrypt.hash('password123', salt);

    // Delete existing demo users
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
    console.log('Demo user accounts seeded.');

    // 2. Clear other collections to prevent duplicate key errors and maintain pristine demo state
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
        status: i % 4 === 0 ? 'Occupied' : 'Available' // 15 available, 5 occupied
      });
    }
    const seededRooms = await Room.insertMany(roomsToSeed);
    console.log(`${seededRooms.length} rooms seeded.`);

    // 4. Seed Patients
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
            date: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
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
        medicalHistory: 'None',
        checkups: []
      },
      {
        nik: '3171012345670003',
        name: 'Robert Downey',
        gender: 'Male',
        birthdate: new Date('1970-12-05'),
        bloodType: 'B+',
        contact: '08111222333',
        address: 'Kemang Raya No. 8, Jakarta',
        medicalHistory: 'Hypertension',
        checkups: [
          {
            date: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
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
        checkups: []
      },
      {
        nik: '3171012345670005',
        name: 'Michael Scott',
        gender: 'Male',
        birthdate: new Date('1965-03-15'),
        bloodType: 'O+',
        contact: '081555666777',
        address: 'Slipi Jaya St. No. 10, Jakarta',
        medicalHistory: 'High Cholesterol',
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
        medicalHistory: 'Post-traumatic stress disorder',
        checkups: []
      }
    ];

    const seededPatients = await Patient.insertMany(patientData);
    console.log(`${seededPatients.length} dummy patients seeded.`);

    // 5. Seed Announcements (created by demo admin)
    const announcementData = [
      {
        content: 'System maintenance scheduled for Sunday, July 26th at 22:00 UTC. All services will be offline for 2 hours.',
        urgency: true,
        author: adminUser._id.toString(),
        createdAt: new Date()
      },
      {
        content: 'New medical equipment has been delivered to Room 3 and Room 4. Training session on Tuesday morning.',
        urgency: false,
        author: adminUser._id.toString(),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
      }
    ];
    await Announcement.insertMany(announcementData);
    console.log('Announcements seeded.');

    // 6. Seed Appointments to populate weekly and monthly charts
    const now = new Date();
    const appts = [];
    const doctors = [doctorUser, docHouse, docGrey];

    // Today's appointments
    const today = new Date();
    
    // Appointment 1: John Doe with Dr. Alexander Pierce
    const time1 = new Date(today);
    time1.setHours(9, 0, 0, 0);
    appts.push({
      patient: seededPatients[0]._id,
      doctor: doctorUser._id,
      dateTime: time1,
      notes: 'Monthly blood pressure review.',
      checkups: [seededPatients[0].checkups[0]]
    });

    // Appointment 2: Jane Smith with Dr. Gregory House
    const time2 = new Date(today);
    time2.setHours(11, 30, 0, 0);
    appts.push({
      patient: seededPatients[1]._id,
      doctor: docHouse._id,
      dateTime: time2,
      notes: 'Consultation regarding persistent leg pain.',
      checkups: []
    });

    // Appointment 3: Robert Downey with Dr. Meredith Grey
    const time3 = new Date(today);
    time3.setHours(14, 0, 0, 0);
    appts.push({
      patient: seededPatients[2]._id,
      doctor: docGrey._id,
      dateTime: time3,
      notes: 'Cardiac follow-up.',
      checkups: [seededPatients[2].checkups[0]]
    });

    // Appointment 4: Emily Watson with Dr. Alexander Pierce
    const time4 = new Date(today);
    time4.setHours(16, 30, 0, 0);
    appts.push({
      patient: seededPatients[3]._id,
      doctor: doctorUser._id,
      dateTime: time4,
      notes: 'Diabetes glucose monitoring checkup.',
      checkups: []
    });

    // Generate Weekly appointments (last 7 days) to populate the Line Chart
    for (let dayOffset = 1; dayOffset <= 6; dayOffset++) {
      const targetDate = new Date(now);
      targetDate.setDate(now.getDate() - dayOffset);
      
      const count = (dayOffset % 3 === 0) ? 3 : (dayOffset % 2 === 0) ? 2 : 1;
      for (let j = 0; j < count; j++) {
        const randomPatient = seededPatients[Math.floor(Math.random() * seededPatients.length)];
        const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];
        const appointmentTime = new Date(targetDate);
        appointmentTime.setHours(10 + j * 2, 0, 0, 0);

        appts.push({
          patient: randomPatient._id,
          doctor: randomDoctor._id,
          dateTime: appointmentTime,
          notes: `Routine follow-up clinic checkup.`,
          checkups: []
        });
      }
    }

    // Generate Monthly appointments (last 6 months) to populate the Bar Chart
    const monthlyCounts = [8, 12, 15, 10, 14];
    for (let monthOffset = 1; monthOffset <= 5; monthOffset++) {
      const targetMonthDate = new Date(now);
      targetMonthDate.setMonth(now.getMonth() - monthOffset);
      
      const countToSeed = monthlyCounts[monthOffset - 1];
      for (let j = 0; j < countToSeed; j++) {
        const randomPatient = seededPatients[Math.floor(Math.random() * seededPatients.length)];
        const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];
        const apptDate = new Date(targetMonthDate);
        apptDate.setDate(Math.max(1, Math.min(28, j * 2 + 1)));
        apptDate.setHours(9 + (j % 4), 0, 0, 0);

        appts.push({
          patient: randomPatient._id,
          doctor: randomDoctor._id,
          dateTime: apptDate,
          notes: `Historical clinic visit records.`,
          checkups: []
        });
      }
    }

    const seededAppts = await Appointment.insertMany(appts);
    console.log(`${seededAppts.length} appointments seeded.`);

    // 7. Seed completed doctor checkups (with AI Diagnosis details)
    const checkupsData = [
      {
        patientId: seededPatients[0]._id,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
        type: 'General Checkup',
        symptoms: 'Mild sore throat and runny nose',
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
          analyzedAt: new Date(),
          aiModel: 'gemini-1.5-flash',
          analysisVersion: '1.0'
        }
      },
      {
        patientId: seededPatients[2]._id,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
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
          confidence: 80,
          confidenceExplanation: 'Combination of trace edema, dyspnea, and hypertension points to fluid retention and high afterload.',
          additionalConsiderations: 'Monitor renal functions regularly.',
          analyzedAt: new Date(),
          aiModel: 'gemini-1.5-flash',
          analysisVersion: '1.0'
        }
      }
    ];

    const seededCheckups = await Checkup.insertMany(checkupsData);
    console.log(`${seededCheckups.length} completed doctor checkups seeded.`);

    console.log('--- Demo Data Seeding Completed Successfully! 🌱 ---');
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
