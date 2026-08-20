import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import bcrypt from 'bcryptjs'
import { connectDB, disconnectDB } from '../src/config/db.js'
import Appointment from '../src/models/Appointment.js'
import Clinician from '../src/models/Clinician.js'
import Invoice from '../src/models/Invoice.js'
import MedicalRecord from '../src/models/MedicalRecord.js'
import Patient from '../src/models/Patient.js'
import Prescription from '../src/models/Prescription.js'
import User from '../src/models/User.js'

import { env } from '../src/config/env.js'

async function seed() {
  console.log('=== CarePoint Database Seeding ===')
  await connectDB()

  try {
    // 1. Seed Admin User from environment configuration
    const adminEmail = env.seedAdminEmail.toLowerCase().trim()
    const adminPassword = env.seedAdminPassword
    const adminName = env.seedAdminName

    let adminUser = await User.findOne({ email: adminEmail })

    if (!adminUser) {
      console.log('Creating initial admin account from .env configuration...')
      const salt = await bcrypt.genSalt(10)
      const passwordHash = await bcrypt.hash(adminPassword, salt)

      adminUser = await User.create({
        name: adminName,
        email: adminEmail,
        passwordHash,
        role: 'admin',
      })
      console.log(`[SEED SUCCESS] Admin created: ${adminEmail}`)
    } else {
      console.log(`[SEED INFO] Admin user already exists: ${adminEmail}`)
    }

    // 2. Seed Clinicians
    const clinicianData = [
      { name: 'Dr. Sarah Jenkins', email: 's.jenkins@carepoint.com', specialization: 'Cardiology', initials: 'SJ', status: 'Active' },
      { name: 'Dr. Robert Chen', email: 'r.chen@carepoint.com', specialization: 'General Practice', initials: 'RC', status: 'Active' },
      { name: 'Dr. Emily Stanton', email: 'e.stanton@carepoint.com', specialization: 'Dental', initials: 'ES', status: 'Active' },
    ]

    const seededClinicians = []
    for (const cData of clinicianData) {
      let doc = await Clinician.findOne({ email: cData.email })
      if (!doc) {
        doc = await Clinician.create(cData)
        console.log(`[SEED SUCCESS] Clinician created: ${doc.name}`)
      } else {
        console.log(`[SEED INFO] Clinician exists: ${doc.name}`)
      }
      seededClinicians.push(doc)
    }

    // 3. Seed Patients
    const patientData = [
      {
        patientCode: '#DF-8842-91A',
        firstName: 'Eleanor',
        lastName: 'Shellstrop',
        email: 'eleanor.shellstrop@example.com',
        phone: '(555) 234-5678',
        dateOfBirth: new Date('1982-10-14'),
        gender: 'Female',
        address: '123 Arizona Ave, Scottsdale, AZ',
        medicalNotes: 'Routine prophylaxis & scaling completed. Active prescription for Amoxicillin.',
      },
      {
        patientCode: '#DF-9012-34B',
        firstName: 'Sarah',
        lastName: 'Jenkins',
        email: 'sarah.j@example.com',
        phone: '(555) 345-6789',
        dateOfBirth: new Date('1990-04-12'),
        gender: 'Female',
        address: '456 Oak St, Austin, TX',
        medicalNotes: 'Annual general checkup requested.',
      },
      {
        patientCode: '#DF-4411-09C',
        firstName: 'Michael',
        lastName: 'Rodriguez',
        email: 'm.rodriguez@example.com',
        phone: '(555) 456-7890',
        dateOfBirth: new Date('1985-08-22'),
        gender: 'Male',
        address: '789 Pine Rd, San Jose, CA',
        medicalNotes: 'Cardiology consult follow-up required.',
      },
      {
        patientCode: '#DF-1122-88D',
        firstName: 'Arthur',
        lastName: 'Pendleton',
        email: 'a.pendleton@example.com',
        phone: '(555) 567-8901',
        dateOfBirth: new Date('1978-11-30'),
        gender: 'Male',
        address: '321 Elm St, Denver, CO',
        medicalNotes: 'Orthopedics assessment scheduled.',
      },
      {
        patientCode: '#DF-3344-55E',
        firstName: 'Eleanor',
        lastName: 'Vance',
        email: 'e.vance@example.com',
        phone: '(555) 678-9012',
        dateOfBirth: new Date('1995-02-18'),
        gender: 'Female',
        address: '654 Maple Dr, Seattle, WA',
        medicalNotes: 'Cardiology routine screening.',
      },
    ]

    const seededPatients = []
    for (const pData of patientData) {
      let doc = await Patient.findOne({ patientCode: pData.patientCode })
      if (!doc) {
        doc = await Patient.create(pData)
        console.log(`[SEED SUCCESS] Patient created: ${doc.firstName} ${doc.lastName}`)
      } else {
        console.log(`[SEED INFO] Patient exists: ${doc.firstName} ${doc.lastName}`)
      }
      seededPatients.push(doc)
    }

    // 4. Seed Appointments
    const apptCount = await Appointment.countDocuments()
    if (apptCount === 0) {
      console.log('Seeding initial appointments...')
      const drJenkins = seededClinicians.find((c) => c.specialization === 'Cardiology') ?? seededClinicians[0]
      const drChen = seededClinicians.find((c) => c.specialization === 'General Practice') ?? seededClinicians[1]
      const drStanton = seededClinicians.find((c) => c.specialization === 'Dental') ?? seededClinicians[2]

      const sampleAppointments = [
        {
          patient: seededPatients[1]._id,
          clinician: drChen._id,
          service: 'General Checkup',
          department: 'General Practice',
          date: new Date('2026-08-24'),
          time: '10:30 AM',
          status: 'Confirmed',
          notes: 'Patient requesting comprehensive physical.',
        },
        {
          patient: seededPatients[2]._id,
          clinician: drJenkins._id,
          service: 'Cardiology Consult',
          department: 'Cardiology',
          date: new Date('2026-08-24'),
          time: '11:15 AM',
          status: 'Pending',
          notes: 'Pre-op evaluation for cardiac scan.',
        },
        {
          patient: seededPatients[3]._id,
          clinician: drChen._id,
          service: 'General Checkup',
          department: 'General Practice',
          date: new Date('2026-08-24'),
          time: '01:00 PM',
          status: 'Confirmed',
          notes: 'Routine checkup.',
        },
      ]

      await Appointment.insertMany(sampleAppointments)
      console.log(`[SEED SUCCESS] ${sampleAppointments.length} sample appointments created.`)
    }

    // 5. Seed Medical Records
    const recordCount = await MedicalRecord.countDocuments()
    if (recordCount === 0) {
      console.log('Seeding initial medical records...')
      await MedicalRecord.insertMany([
        {
          patient: seededPatients[0]._id,
          clinician: seededClinicians[2]._id,
          recordType: 'Radiology',
          title: 'Full Mouth Radiographic Survey',
          notes: 'X-rays show no periapical lesions. Monitor restoration on #14.',
          status: 'Final',
        },
        {
          patient: seededPatients[1]._id,
          clinician: seededClinicians[1]._id,
          recordType: 'Lab Test',
          title: 'Comprehensive Metabolic & Lipid Panel',
          notes: 'Glucose 92 mg/dL, Total Cholesterol 185 mg/dL. All within normal limits.',
          status: 'Final',
        },
        {
          patient: seededPatients[2]._id,
          clinician: seededClinicians[0]._id,
          recordType: 'Clinical Summary',
          title: 'Echocardiogram Diagnostic Review',
          notes: 'Normal LVEF 60-65%, mild aortic valve sclerosis noted.',
          status: 'Final',
        },
      ])
      console.log('[SEED SUCCESS] Sample medical records created.')
    }

    // 6. Seed Prescriptions
    const rxCount = await Prescription.countDocuments()
    if (rxCount === 0) {
      console.log('Seeding initial prescriptions...')
      await Prescription.insertMany([
        {
          patient: seededPatients[0]._id,
          clinician: seededClinicians[2]._id,
          medicationName: 'Amoxicillin',
          dosage: '500mg',
          frequency: '1 capsule every 8 hours',
          duration: '7 days',
          refills: 0,
          status: 'Active',
          notes: 'Take with food or milk.',
        },
        {
          patient: seededPatients[0]._id,
          clinician: seededClinicians[2]._id,
          medicationName: 'Chlorhexidine 0.12%',
          dosage: '15ml rinse',
          frequency: 'Twice daily after brushing',
          duration: '14 days',
          refills: 2,
          status: 'Active',
          notes: 'Do not swallow. Swish for 60 seconds.',
        },
        {
          patient: seededPatients[2]._id,
          clinician: seededClinicians[0]._id,
          medicationName: 'Atorvastatin',
          dosage: '20mg',
          frequency: 'Once daily at bedtime',
          duration: '90 days',
          refills: 3,
          status: 'Active',
          notes: 'Monitor liver enzymes in 6 months.',
        },
      ])
      console.log('[SEED SUCCESS] Sample prescriptions created.')
    }

    // 7. Seed Invoices
    const invoiceCount = await Invoice.countDocuments()
    if (invoiceCount === 0) {
      console.log('Seeding initial invoices...')
      await Invoice.insertMany([
        {
          invoiceCode: 'INV-2026-8812',
          patient: seededPatients[0]._id,
          service: 'General Checkup & Dental Prophylaxis',
          amount: 145.00,
          dueDate: new Date('2026-09-15'),
          status: 'Pending',
          notes: 'Copay due after insurance adjustment.',
        },
        {
          invoiceCode: 'INV-2026-9041',
          patient: seededPatients[1]._id,
          service: 'Teeth Whitening Procedure',
          amount: 299.00,
          dueDate: new Date('2026-08-30'),
          status: 'Paid',
          notes: 'Paid via credit card ending in 4421.',
        },
        {
          invoiceCode: 'INV-2026-1102',
          patient: seededPatients[2]._id,
          service: 'Cardiology Diagnostic Screening',
          amount: 199.00,
          dueDate: new Date('2026-08-10'),
          status: 'Overdue',
          notes: 'Second reminder notice sent.',
        },
      ])
      console.log('[SEED SUCCESS] Sample billing invoices created.')
    }

    console.log('=== Database Seeding Complete ===')
  } catch (error) {
    console.error('[SEED ERROR]', error)
  } finally {
    await disconnectDB()
  }
}

seed()
