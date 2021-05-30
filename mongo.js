const mongoose = require('mongoose')
const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env

const connectionString = NODE_ENV === 'test'
  ? MONGO_DB_URI_TEST
  : MONGO_DB_URI

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
  .then(console.log('connection with mongoDb was correct'))
  .catch(err => console.log(err))

// si en el proceso tenemos un error, nos cerrara la conexion con el servidor de mongoose
process.on('uncaughtException', () => {
  mongoose.disconnect()
})
