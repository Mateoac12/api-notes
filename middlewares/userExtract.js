const jwt = require('jsonwebtoken')

module.exports = async (request, response, next) => {
  const authorization = request.get('Authorization')

  const isAuthorization = authorization && authorization.toLowerCase().startsWith('bearer')
  const encryptedToken = isAuthorization
    ? authorization.substring(7)
    : ''

  let token = ''
  jwt.verify(encryptedToken, process.env.SECRET, { expiresIn: '7d' },
    (err, decoded) => {
      decoded === null
        ? response.status(401).send({ error: err })
        : token = decoded
    }
  )

  if (!token || !token.id) return response.status(401).send({ error: 'Missing or invalid token' })

  response.userId = token.id
  next()
}
