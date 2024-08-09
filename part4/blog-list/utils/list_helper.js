const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((accumulator, blog) => {
    return accumulator + blog.likes
  }, 0)
}

function findMostLikedBlog(blogs) {
  if (blogs.length === 0) {
    return 0
  }

  let mostLikedBlog = blogs[0]

  for (let i = 1; i < blogs.length; i++) {
    if (blogs[i].likes > mostLikedBlog.likes) {
      mostLikedBlog = blogs[i] // Update if the current blog has more likes
    }
  }

  return mostLikedBlog
}

function mostBlogsByAuthor(blogs) {
  // find the blog count for each author
  const authorCounts = _.countBy(blogs, 'author')

  // find author with most blogs using lodash function maxBy
  const topAuthor = _.maxBy(Object.keys(authorCounts), (author) => authorCounts[author])

  return {
    author: topAuthor,
    blogs: authorCounts[topAuthor],
  }
}

function mostLikedAuthor(blogs) {
  // find the like count for each author
  const authorLikes = blogs.reduce((acc, blog) => {
    if (acc[blog.author]) {
      acc[blog.author] += blog.likes
    } else {
      acc[blog.author] = blog.likes
    }
    return acc
  }, {})

  // find author with most blogs using lodash function maxBy
  const mostLiked = _.maxBy(Object.keys(authorLikes), (author) => authorLikes[author])

  return {
    author: mostLiked,
    likes: authorLikes[mostLiked],
  }
}

module.exports = {
  dummy,
  totalLikes,
  findMostLikedBlog,
  mostBlogsByAuthor,
  mostLikedAuthor,
}
