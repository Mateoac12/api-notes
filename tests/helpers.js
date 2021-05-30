const supertest = require('supertest')
const { app } = require('../index')

const api = supertest(app)

const initialNotes = [
  {
    title: 'Test 1',
    content: 'This is the first test',
    important: true
  }, {
    title: 'Test 2',
    content: 'This is the second test',
    important: false
  }
]

module.exports = { initialNotes, beforeEach, api }
