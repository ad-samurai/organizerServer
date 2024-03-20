const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce(
    (a, b) => a + b.likes, 
    0,
    )
}

const favoriteBlog = (blogs) => {
  let favorite = {}
  let likes = -1

  for (let blog of blogs) {
    if(blog.likes > likes) {
      likes = blog.likes
      favorite = blog
    }
  }

  if (!favorite.likes) return favorite
  
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  }
}

const mostBlogs = (blogs) => {
  const blogers = _.countBy(blogs, "author")
  let author = ''
  let amount = -1

  for (const [key, value] of Object.entries(blogers)) {
    if(value > amount) {
      author = key
      amount = value
    }
  }

  if(!author) return {}

  return {
    author,
    blogs: amount
  }
}

const mostLikes = (blogs) => {
  const obj = {}
  debugger
  for (let blog of blogs) {
    if(obj[blog.author]) {
      obj[blog.author] += blog.likes
      continue
    }
    obj[blog.author] = blog.likes
  }

  let author = ''
  let likes = -1

  for (const [key, value] of Object.entries(obj)) {
    if(value > likes) {
      author = key
      likes = value
    }
  }

  if(!author) return {}

  return {
    author,
    likes,
  }

}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}