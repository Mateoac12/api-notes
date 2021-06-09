require('dotenv').config()
const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')
const userExtract = require('../middlewares/userExtract')

notesRouter.get('/', userExtract, (request, response, next) => {
  const userId = response.userId

  Note.find({ user: userId }).populate('user', {
    username: 1,
    name: 1
  })
    .then(res => response.json(res))
    .catch(err => next(err))
})

notesRouter.get('/:id', userExtract, (request, response, next) => {
  const { id } = request.params
  const userId = response.userId

  Note.findOne({ _id: id, user: userId }).populate('user', {
    username: 1,
    name: 1
  })
    .then(res => {
      response.json(res)
    })
    .catch(err => next(err))
})

notesRouter.delete('/:id', userExtract, async (request, response, next) => {
  const { id } = request.params

  const note = await Note.findById(id)
  const user = await User.findById(note.user)

  Note.findByIdAndDelete(id)
    .then((res) => {
      user.notes = user.notes.filter(note => note !== res._id)
      user.save()
      response.json(204)
    })
    .catch(err => next(err))
})

notesRouter.post('/', userExtract, async (request, response, next) => {
  const note = request.body

  // coloco el userId de la response en el middleware de userExtract
  const userId = response.userId
  const user = await User.findById(userId)
  const newNote = new Note({
    title: note.title || '',
    content: note.content || '',
    important: note.important || false,
    user: userId
  })

  newNote.save()
    .then(res => {
      user.notes = user.notes.concat(res._id)
      user.save()
      response.json(res)
    })
    .catch(err => next(err))
})

notesRouter.put('/:id', userExtract, (request, response, next) => {
  const { id } = request.params
  const note = request.body
  const { title, content, important } = note

  const updatedNote = {
    title,
    content,
    important
  }
  console.log({ updatedNote })
  Note.findByIdAndUpdate(id, updatedNote, { new: true })
    .then(res => response.json(res))
    .catch(err => next(err))
})

module.exports = notesRouter
