const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'The End of The World As We Know It',
    author: 'The Man',
    url: 'www.example.com/eoftwawki2',
    likes: 23,
  },
  {
    title: 'In The Beginning',
    author: 'G-d',
    url: 'www.example.com/theword',
    likes: 12003,
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
}
