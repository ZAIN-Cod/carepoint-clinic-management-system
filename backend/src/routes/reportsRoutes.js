import express from 'express'
import { getAnalytics } from '../controllers/reportsController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.use(requireAuth)

router.get('/analytics', getAnalytics)

export default router
