const ListHelper = require('../utils/list_helper')

const listWithOneBLog = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  }
]

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

test('dummy returns one', () => {
  const blogs = []

  expect(ListHelper.dummy(blogs)).toBe(1)
})

describe('total likes', () => {

  test('when list has only one blog, equals the likes of that', () => {
    const result = ListHelper.totalLikes(listWithOneBLog)
    expect(result).toBe(7)
  })
  
  test('when list has many blogs, return total number of likes', () => {
    const result = ListHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })
  
  test('when list has no one blog, number of likes is 0', () => {
    const result = ListHelper.totalLikes([])
    expect(result).toBe(0)
  })

})
describe('Fvorite blog', () => {

  test('when list has one blog, equal to this blog', () => {
    const answer = {author: "Michael Chan", likes: 7, "title": "React patterns"}
    const result = ListHelper.favoriteBlog(listWithOneBLog)
    expect(result).toEqual(answer)
  })

  test('when list has many blogs, equel the best blog', () => {
    const answer = {title: "Canonical string reduction", author: "Edsger W. Dijkstra", likes: 12}
    const result = ListHelper.favoriteBlog(blogs)
    expect(result).toEqual(answer)
  })

  test('when the list is empty, it is equal to an empty object', () => {
    const result = ListHelper.favoriteBlog([])
    expect(result).toEqual({})
  })

})

describe('most blogs', () => {

  test('when list has one blog, equal to this author', () => {
    const answer = {author: "Michael Chan", blogs: 1}
    const result = ListHelper.mostBlogs(listWithOneBLog)
    expect(result).toEqual(answer)
  })
  
  test('when list has many blogs, equel the best author', () => {
    const answer = {author: "Robert C. Martin", blogs: 3}
    const result = ListHelper.mostBlogs(blogs)
    expect(result).toEqual(answer)
  })

  test('when list has no one blogs, it is equal to an empty object', () => {
    const result = ListHelper.mostBlogs([])
    expect(result).toEqual({})
  })
})

describe('most likes', () => {

  test('when list has one blog, equal his author', () => {
    const answer = {author: "Michael Chan", likes: 7}
    const result = ListHelper.mostLikes(listWithOneBLog)
    expect(result).toEqual(answer)
  })

  test('when list has many blogs, equel the best author', () => {
    const answer = {author: "Edsger W. Dijkstra", likes: 17}
    const result = ListHelper.mostLikes(blogs)
    expect(result).toEqual(answer)
  })

  test('when list has no one blogs, it is equal to an empty object', () => {
    const result = ListHelper.mostLikes([])
    expect(result).toEqual({})
  })
})