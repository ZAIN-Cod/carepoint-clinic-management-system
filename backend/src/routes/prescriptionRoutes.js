import express from 'express'
import { createPrescription, getPrescriptions, requestRefill } from '../controllers/prescriptionController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.use(requireAuth)

router.get('/', getPrescriptions)
router.post('/', createPrescription)
router.put('/:id/refill', requestRefill)

export default router
