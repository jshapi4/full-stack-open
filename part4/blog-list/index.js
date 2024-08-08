const express = require('express')
const app = express()
const config = require('./utils/config')
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})

//require("dotenv").config();

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = process.env.MONGODB_URI
mongoose
  .connect(mongoUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error: ', error))

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

app.post('/api/blogs', (request, response, next) => {
  const body = request.body
  // console.log("req body: ", body);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  })

  blog
    .save()
    .then((savedBlog) => {
      response.json(savedBlog)
      console.log(savedBlog)
    })
    .catch((error) => next(error))
})
