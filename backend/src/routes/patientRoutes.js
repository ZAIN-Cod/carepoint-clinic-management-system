import express from 'express'
import { createPatient, deletePatient, getPatientById, getPatients, updatePatient } from '../controllers/patientController.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = express.Router()

router.use(requireAuth)

router.get('/', getPatients)
router.get('/:id', getPatientById)
router.post('/', createPatient)
router.put('/:id', updatePatient)
router.delete('/:id', requireRole('admin', 'receptionist'), deletePatient)

export default router
