const Blog = require('../moduls/blog')
const User = require('../moduls/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
]

const initialUsers = [
  {
    username: "tester",
    name: "Supertester",
    password: "secret"
  }
]

const getToken = async () => {
  const username = initialUsers[0].username
  const user = await User.findOne({ username })

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(
    userForToken, 
    config.SECRET
  )

  return token
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const nonExistingId = async () => {
  const blog = new Note({
    title: "willremovethissoon",
    author: "willremovethissoon",
    url: "willremovethissoon",
    likes: 0,
  })

  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogsAtStart = blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, 
  nonExistingId, 
  blogsInDb, 
  usersInDb, 
  initialUsers,
  getToken
}