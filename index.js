require('dotenv').config()
// para conectar el servicio con mongoDB directamente al comienzo del archivo
require('./mongo')
const express = require('express')

const cors = require('cors')
const app = express()

const notFound = require('./middlewares/notFound')
const handleErrors = require('./middlewares/handleErrors')

const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

/*  sirve para permitir a otros dominios consumir la api  */
app.use(cors())
/*  sirve para que se pueda hacer un post  */
app.use(express.json())

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/login', loginRouter)

app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT
// es async, por lo que cuando termina de hacen la conexion, tira el console.log
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
