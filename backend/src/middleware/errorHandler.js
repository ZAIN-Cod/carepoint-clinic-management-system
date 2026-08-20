function errorHandler(error, request, response, next) {
  const statusCode = error.statusCode ?? 500
  const message = statusCode >= 500 ? 'An unexpected server error occurred.' : error.message

  if (statusCode >= 500) {
    console.error(`[${new Date().toISOString()}] ${error.name}: ${error.message}`)
  }

  response.status(statusCode).json({
    error: {
      message,
      statusCode,
    },
  })
}

export default errorHandler
