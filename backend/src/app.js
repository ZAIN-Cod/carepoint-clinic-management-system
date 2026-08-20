import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import errorHandler from './middleware/errorHandler.js'
import notFound from './middleware/notFound.js'
import appointmentRoutes from './routes/appointmentRoutes.js'
import authRoutes from './routes/authRoutes.js'
import billingRoutes from './routes/billingRoutes.js'
import clinicianRoutes from './routes/clinicianRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import healthRouter from './routes/healthRoutes.js'
import medicalRecordRoutes from './routes/medicalRecordRoutes.js'
import patientRoutes from './routes/patientRoutes.js'
import prescriptionRoutes from './routes/prescriptionRoutes.js'
import reportsRoutes from './routes/reportsRoutes.js'

const app = express()

app.disable('x-powered-by')
app.use(cors({ origin: [env.clientUrl, env.frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'], credentials: true }))
app.use(express.json({ limit: '1mb' }))

// Register API Endpoints
app.use('/api/health', healthRouter)
app.use('/api/auth', authRoutes)
app.use('/api/patients', patientRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/clinicians', clinicianRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/medical-records', medicalRecordRoutes)
app.use('/api/prescriptions', prescriptionRoutes)
app.use('/api/billing', billingRoutes)
app.use('/api/reports', reportsRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
