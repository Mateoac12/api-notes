const mongoose = require('mongoose')

const connectionString = process.env.MONGODB_SERVER_URI

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(console.log('connection with mongoDb was correct'))
  .catch(err => console.error(err))

// si en el proceso tenemos un error, nos cerrara la conexion con el servidor de mongoose
process.on('uncaughtException', () => {
  mongoose.connection.disconnect()
})
