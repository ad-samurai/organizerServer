const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../moduls/blog')
const User = require('../moduls/user')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

beforeAll(async () => {
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
})

const api = supertest(app)


describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api 
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('there is an id property', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
  })
})

describe('viewing a specific blog', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0]
  
    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultBlog.body).toEqual(blogToView)
  })
})


describe('addition of a new blog', () => {

  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
    }

    const token = await helper.getToken()
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', 'Bearer ' + token)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).toContain(
      'Canonical string reduction'
    )  
  })

  test('if there are no likes then it si 0', async () => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    }

    const token = await helper.getToken()

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', 'Bearer ' + token)
      .expect(201)

    const blogsAtEnd = await helper.blogsInDb()
    const lastBlogs = blogsAtEnd[helper.initialBlogs.length]

    expect(lastBlogs.likes).toBe(0)
  })

  test('fails with status code 400 if request not contains title and url', async () => {
    const newBlog = {
      author: "Edsger W. Dijkstra",
      likes: 12
    }
    const token = await helper.getToken()

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', 'Bearer ' + token)
      .expect(400)
    
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('fails with status code 401 if a token is not provided', async () => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  }, 20000)


})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )
  
    const contents = blogsAtEnd.map(r => r.title)
    expect(contents).not.toContain(blogToDelete.title)
  })
})

describe('changing part of the blog', () => {
  test('chenging likes blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToPut = blogsAtStart[0]

    const newBlog = {
      title: blogToPut.title,
      author: blogToPut.author,
      url: blogToPut.url,
      likes: 2,
    }

    await api
      .put(`/api/blogs/${blogToPut.id}`)
      .send(newBlog)
    
    const blogsAtEnd = await helper.blogsInDb()
    const blogToComparision = blogsAtEnd[0]
    expect(blogToComparision.likes).toBe(2)
  })
})


afterAll(async () => {
  await mongoose.connection.close()
})