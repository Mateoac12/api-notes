const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')

notesRouter.get('/', (request, response, next) => {
  Note.find({}).populate('user', {
    username: 1,
    name: 1
  })
    .then(res => response.json(res))
    .catch(err => next(err))
})

notesRouter.get('/:id', (request, response, next) => {
  const { id } = request.params
  Note.findById(id).populate('user', {
    username: 1,
    name: 1
  })
    .then(res => response.json(res))
    .catch(err => next(err))
})

notesRouter.delete('/:id', async (request, response, next) => {
  const { id } = request.params

  const note = await Note.findById(id)
  const user = await User.findById(note.user)

  Note.findByIdAndDelete(id)
    .then((res) => {
      user.notes = user.notes.filter(note => note !== res._id)
      user.save()
      console.log(user)
      response.json(204)
    })
    .catch(err => next(err))
})

notesRouter.post('/', async (request, response, next) => {
  const note = request.body

  const user = await User.findById(note.userId)

  const newNote = new Note({
    title: note.title || '',
    content: note.content || '',
    important: note.important || false,
    user: user._id
  })

  newNote.save()
    .then(res => {
      user.notes = user.notes.concat(res._id)
      user.save()
      response.json(res)
    })
    .catch(err => next(err))
})

notesRouter.put('/:id', (request, response, next) => {
  const note = request.body
  Note.findByIdAndUpdate(note.id, { new: true })
    .then(res => response.json(res))
    .catch(err => next(err))
})

module.exports = notesRouter
