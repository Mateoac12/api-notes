
const ERROR_HANDLERS = {
  ValidationError: (res, { message }) => res.status(400).send({ err: message }),

  JsonWebTokenError: (res, err) => res.status(401).send({ error: err }),

  DefaultError: (res, err) => {
    console.log({ err })
    res.status(500).end()
  }
}

module.exports = (error, request, response, next) => {
  console.log('pepito error')

  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.DefaultError

  handler(response, error)
}
