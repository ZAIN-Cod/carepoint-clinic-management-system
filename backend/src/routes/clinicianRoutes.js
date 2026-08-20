import express from 'express'
import { createClinician, getClinicianById, getClinicians } from '../controllers/clinicianController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.use(requireAuth)

router.get('/', getClinicians)
router.get('/:id', getClinicianById)
router.post('/', createClinician)

export default router
