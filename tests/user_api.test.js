const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const User = require('../moduls/user')
const bcrypt = require('bcrypt')

describe('when there is initially one user in db', () => {

  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creating succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mpolysan',
      name: 'Misha Polyansky',
      password: 'secret'
    }
    
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-type', /application\/json/)
    
    const userAtEnd = await helper.usersInDb()
    expect(userAtEnd).toHaveLength(usersAtStart.length + 1)
    
    const username = userAtEnd.map(u => u.username)
    expect(username).toContain(newUser.username)
  })

  describe('creating fails with proper statuscode and message if', () => {
    test('username alredy taken', async () => {
      const userAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'secret'
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-type', /application\/json/)
  
      expect(result.body.error).toContain('expected `username` to be unique')
  
      const userAtEnd = await helper.usersInDb()
      expect(userAtEnd).toEqual(userAtStart)
    })

    test('lengh `usermane` less then 3', async () => {
      const usersAtStart = await helper.usersInDb()

      const user = {
        user: 'tester',
        password: 'secret',
        username: 'te'
      }

      const result = await api
        .post('/api/users')
        .send(user)
        .expect(400)
        .expect('Content-type', /application\/json/)

      expect(result.body.error).toContain('expected `username` less than 3')

      const userAtEnd = await helper.usersInDb()
      expect(userAtEnd).toEqual(usersAtStart)
    })

    test('lengh `password` less then 3', async () => {
      const usersAtStart = await helper.usersInDb()

      const user = {
        username: 'tester',
        user: 'tester',
        password: 's'
      }

      const result = await api
        .post('/api/users')
        .send(user)
        .expect(400)
        .expect('Content-type', /application\/json/)

      expect(result.body.error).toContain('expected `password` less than 3')

      const userAtEnd = await helper.usersInDb()
      expect(userAtEnd).toEqual(usersAtStart)
    })

    test('missing `username`', async () => {
      const usersAtStart = await helper.usersInDb()

      const user = {
        user: 'tester',
        password: 'secret'
      }

      const result = await api
        .post('/api/users')
        .send(user)
        .expect(400)
        .expect('Content-type', /application\/json/)

      expect(result.body.error).toContain('username or passwerd missing')

      const userAtEnd = await helper.usersInDb()
      expect(userAtEnd).toEqual(usersAtStart)
    })

    test('missing `password`', async () => {
      const userAtStart = await helper.usersInDb()

      const user = {
        user: 'tester',
        username: 'tester',
      }

      const result = await api
        .post('/api/users')
        .send(user)
        .expect(400)
        .expect('Content-type', /application\/json/)

      expect(result.body.error).toContain('username or passwerd missing')

      const userAtEnd = await helper.usersInDb()
      expect(userAtEnd).toEqual(userAtStart)
    })
  })

})