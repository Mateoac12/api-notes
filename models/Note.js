const { Schema, model } = require('mongoose') 

// asi van a tener que ser los modelos que vayamos a crear
const noteSchema = new Schema({
  title: String,
  content: String,
  important: Boolean,
  date: Date
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// creamos el modelo de nombres Note en la aplicacion (que luego se transforma a notes en MongoDB), y que tiene que seguir ese esquema
const Note = model('Note', noteSchema)

module.exports = Note
