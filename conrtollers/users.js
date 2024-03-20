const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../moduls/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!(password && username)) {
    return response.status(400).json({
      error: 'username or passwerd missing'
    })
  }
  
  if (password.length < 3) {
    return response.status(400).json({
      error: 'expected `password` less than 3'
    })
  }
  
  if (username.length < 3) {
    return response.status(400).json({
      error: 'expected `username` less than 3'
    })
  }

  const found = await User.findOne({ username })
  if (!(found === null)) {
    return response.status(400).json({
      error: 'expected `username` to be unique'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  const users = await User
    .findById(request.params.id)
  response.json(users)
})

module.exports = usersRouter