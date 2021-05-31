const { api, beforeEach } = require('./helpers')
const mongoose = require('mongoose')
const { server } = require('../index')
const User = require('../models/User')

describe('users', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const initialUser = {
      username: 'Madeval',
      name: 'Mateo',
      passwordHash: 'holapasscomplicadadereso1ver'
    }

    const newUser = new User(initialUser)
    await newUser.save()
  })

  test('get all users and as json', async () => {
    const response = await api.get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const allUsers = await User.find({})
    expect(response.body).toHaveLength(allUsers.length)
  })

  test('got specific user by id', async () => {
    const users = await User.find({})
    const [firstUser] = users
    const { _id: id } = firstUser
    const response = await api.get(`/api/users/${id}`)

    expect([response.body]).toHaveLength(users.length)
    expect(response.body.id).toContain(String(id))
  })

  test('created new user', async () => {
    const user = {
      username: 'Madeval1',
      name: 'Mateo 1',
      passwordHash: 'holapasscomplicadadereso1ver'
    }

    await api.post('/api/users')
      .send(user)
      .expect(200)
  })

  test('verificated users was unique', async () => {
    const newUser = {
      username: 'Madeval',
      name: 'Mat',
      passwordHash: 'test'
    }

    const response = await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    console.log(response.body)
  })

  afterAll(() => {
    mongoose.connection.close()
    server.close()
  })
})
