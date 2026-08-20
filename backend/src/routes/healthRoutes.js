import { Router } from 'express'

const healthRouter = Router()

healthRouter.get('/', (request, response) => {
  response.status(200).json({
    status: 'ok',
    service: 'carepoint-clinic-api',
    timestamp: new Date().toISOString(),
  })
})

export default healthRouter
