import express from 'express'
import { createMedicalRecord, getMedicalRecords } from '../controllers/medicalRecordController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.use(requireAuth)

router.get('/', getMedicalRecords)
router.post('/', createMedicalRecord)

export default router
