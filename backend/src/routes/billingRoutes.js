import express from 'express'
import { createInvoice, getInvoices, markAsPaid } from '../controllers/billingController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.use(requireAuth)

router.get('/', getInvoices)
router.post('/', createInvoice)
router.put('/:id/pay', markAsPaid)

export default router
