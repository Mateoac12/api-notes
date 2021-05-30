const mongoose = require('mongoose')
const { server } = require('../index')
const { initialNotes, api } = require('./helpers')
const Note = require('../models/Note')

describe('notes', () => {
  beforeEach(async () => {
    await Note.deleteMany({})

    for (const note of initialNotes) {
      const newNote = new Note(note)
      await newNote.save()
    }
  })

  test('returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returned notes', async () => {
    const response = await api.get('/api/notes')

    expect(response.body).toHaveLength(initialNotes.length)
  })

  test('find title of the first note', async () => {
    const [firstNote] = await Note.find({})
    const { _id: noteId } = firstNote
    const { body: noteToFind } = await api.get(`/api/notes/${noteId}`)

    expect(noteToFind.title).toBe('Test 1')
  })

  test('find content of all notes', async () => {
    const response = await api.get('/api/notes')
    const contents = response.body.map(note => note.content)

    expect(contents).toContain('This is the first test')
  })

  test('deleted one note', async () => {
    const response = await api.get('/api/notes')
    const [firstNote] = response.body
    const { id: noteId } = firstNote

    const deletedNote = await api.delete(`/api/notes/${noteId}`)
    const secondResponse = await api.get('/api/notes')

    expect(deletedNote.body).toBe(204)
    expect(secondResponse.body).toHaveLength(initialNotes.length - 1)
  })

  test('put one note', async () => {
    const note = {
      title: 'Testing',
      content: 'testing content',
      important: false
    }

    const newNote = new Note(note)
    await newNote.save()

    const { body: response } = await api.get('/api/notes')
    const [lastNote] = response.slice(-1)

    expect(response).toHaveLength(initialNotes.length + 1) // (not +1) because in the last test removed one item
    expect(lastNote.content).toEqual(note.content)
  })

  afterAll(() => {
    mongoose.connection.close()
    server.close()
  })
})
