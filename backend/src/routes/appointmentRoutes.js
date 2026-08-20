import express from 'express'
import { createAppointment, deleteAppointment, getAppointmentById, getAppointments, updateAppointment } from '../controllers/appointmentController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.use(requireAuth)

router.get('/', getAppointments)
router.get('/:id', getAppointmentById)
router.post('/', createAppointment)
router.put('/:id', updateAppointment)
router.delete('/:id', deleteAppointment)

export default router
