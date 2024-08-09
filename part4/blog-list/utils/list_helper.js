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

module.exports = {
  dummy,
  totalLikes,
  findMostLikedBlog,
}
