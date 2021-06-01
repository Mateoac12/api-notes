require('dotenv').config()
const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

loginRouter.post('/', async (request, response, next) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const correctPassword = user
    ? bcrypt.compare(password, user.passwordHash)
    : false

  if (!(user && correctPassword)) {
    response.status(401).send({ error: 'Username or password incorrected' })
  }

  const userForToken = {
    id: user._id,
    username: user.username
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response.send({
    username,
    name: user.name,
    token
  })
})

module.exports = loginRouter
