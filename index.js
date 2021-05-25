const express = require('express')
const cors = require('cors')
const app = express()
/*  sirve para permitir a otros dominios consumir la api  */
app.use(cors())
/*  sirve para que se pueda hacer un post  */
app.use(express.json())

let notes = []

app.get('/', (_request, response) => {
  response.send('<h1>Hola Midu gracias por estos contendidos!!!</h1>')
})

app.get('/api/notes', (_request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const { id } = request.params
  const numberId = Number(id)
  const singleNote = notes.find(note => note.id === numberId)

  !singleNote && response.status(404).send({
    error: 'Imposible find this note'
  })
  response.json(singleNote)
})

app.delete('/api/notes/:id', (request, response) => {
  const { id } = request.params
  const numberId = Number(id)
  // eslint-disable-next-line
  notes = notes.filter(note => note.id !== numberId)

  /*  significa 'no content', porque el elemento que eliminamos ya no esta */
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body
  const ids = notes.map(note => note.id)
  const newId = Math.max(...ids)

  /*  significa 'bad request', se usa cuando no se pudo crear un recurso  */
  /*  es necesario poner el end() sino sigue el proceso y lo genera en el .json del final  */
  !note.name && response.status(400)
    .json({ error: 'Imposible create a note' })
    .end()

  const newNote = {
    id: newId + 1,
    name: note.name,
    title: note.title || 'Nueva nota',
    content: note.content || '',
    important: note.important || false
  }

  notes = [...notes, newNote]

  response.json(newNote)
})

app.use((_, response) => {
  response.json({
    error: '404 page not found'
  }).status(404)
})

const PORT = process.env.PORT || 3001

// es async, por lo que cuando termina de hacen la conexion, tira el console.log
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
