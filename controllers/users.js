const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.get('/', (request, response, next) => {
  User.find({})
    .then(res => response.json(res))
    .catch(err => next(err))
})

usersRouter.get('/:id', (request, response, next) => {
  const { id } = request.params
  User.findById(id)
    .then(res => response.json(res))
    .catch(err => next(err))
})

usersRouter.delete('/:id', (request, response, next) => {
  const { id } = request.params

  User.findByIdAndDelete(id)
    .then(() => response.status(204))
    .catch(err => next(err))
})

usersRouter.post('/', (request, response, next) => {
  const user = request.body

  const newUser = new User({
    username: user.username,
    name: user.name,
    passwordHash: user.passwordHash
  })

  newUser.save()
    .then(res => response.json(res))
    .catch(err => next(err))
})

module.exports = usersRouter
