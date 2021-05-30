const notesRouter = require('express').Router()
const Note = require('../models/Note')

notesRouter.get('/', (request, response, next) => {
  Note.find({})
    .then(res => response.json(res))
    .catch(err => next(err))
})

notesRouter.get('/:id', (request, response, next) => {
  const { id } = request.params
  Note.findById(id)
    .then(res => response.json(res))
    .catch(err => next(err))
})

notesRouter.delete('/:id', (request, response, next) => {
  const { id } = request.params
  Note.findByIdAndDelete(id)
    .then(() => response.json(204))
    .catch(err => next(err))
})

notesRouter.post('/', (request, response, next) => {
  const note = request.body

  const newNote = new Note({
    title: note.title || '',
    content: note.content || '',
    important: note.important || false
  })

  newNote.save()
    .then(res => response.json(res))
    .catch(err => next(err))
})

notesRouter.put('/:id', (request, response, next) => {
  const note = request.body
  Note.findByIdAndUpdate(note.id, { new: true })
    .then(res => response.json(res))
    .catch(err => next(err))
})

module.exports = notesRouter
