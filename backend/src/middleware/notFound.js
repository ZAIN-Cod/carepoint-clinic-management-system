import AppError from '../utils/AppError.js'

function notFound(request, response, next) {
  next(new AppError(`Route ${request.method} ${request.originalUrl} was not found.`, 404))
}

export default notFound
