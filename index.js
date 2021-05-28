require('dotenv').config()
// para conectar el servicio con mongoDB directamente al comienzo del archivo
require('./mongo')

const express = require('express')
const cors = require('cors')
const app = express()
const Note = require('./models/Note')

const notFound = require('./middlewares/notFound')
const handleErrors = require('./middlewares/handleErrors')

/*  sirve para permitir a otros dominios consumir la api  */
app.use(cors())
/*  sirve para que se pueda hacer un post  */
app.use(express.json())

app.get('/', (_request, response) => {
  response.send('<h1>Hola Midu gracias por estos contendidos!!!</h1>')
})

app.get('/api/notes', (_request, response, next) => {
  Note.find({})
    .then(res => response.json(res))
    .catch(err => next(err))
})

app.get('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  Note.findById(id)
    .then(res => response.json(res))
    .catch(err => next(err))
})

app.delete('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  Note.findByIdAndDelete(id)
    .then(() => response.json(204))
    .catch(err => next(err))
})

app.post('/api/notes', (request, response, next) => {
  const note = request.body

  const newNote = new Note({
    title: note.title,
    content: note.content,
    important: note.important
  })

  newNote.save()
    .then(res => response.json(res))
    .catch(err => next(err))
})

app.put('/api/notes', (request, response, next) => {
  const note = request.body
  Note.findByIdAndUpdate(note.id, { new: true })
    .then(res => response.json(res))
    .catch(err => next(err))
})

app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT

// es async, por lo que cuando termina de hacen la conexion, tira el console.log
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
