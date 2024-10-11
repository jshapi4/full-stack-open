const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

// exercise 4.8 verify the blog list application returns the correct amount of blog posts in the JSON format

test('correct amount of blog posts are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

// exercise 4.9: verify that the unique identifier is named ID

test('unique identifier is named id', async () => {
  const response = await api.get('/api/blogs')

  const blogs = response.body
  blogs.forEach((blog) => {
    assert(blog.id, 'id field is missing')
  })
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, 2)
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'Test Verification',
    author: 'Test Author',
    url: 'www.test.com',
    likes: 42,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  const titles = blogsAtEnd.map((b) => b.title)
  assert(titles.includes('Test Verification'))
})

// Exercise 4.11 - Verify if the likes property is missing, will default to 0
test('verify the likes property will default to 0 if not defined', async () => {
  const blogWithoutLikesDefined = {
    title: 'Blog Without Likes',
    author: 'Zero Likes',
    url: 'www.nobodylikesme.com',
  }

  const response = await api
    .post('/api/blogs')
    .send(blogWithoutLikesDefined)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const resultBlog = await api
    .get(`/api/blogs/${response.body.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(resultBlog.body.likes, 0)
})

// exercise 4.12: verify that if the title or url properties are missing, backend will respond with 400 code"

test('verify that if the title or url properties are missing, backend will respond with 400', async () => {
  const blogWithoutTitle = {
    author: 'No Title Man',
    url: 'www.notitle.com',
    likes: 1000000,
  }

  const blogWithoutUrl = {
    title: 'I Do Not Have A URL',
    author: 'Link Larkin',
    likes: 1452,
  }

  const response1 = await api.post('/api/blogs').send(blogWithoutTitle).expect(400)

  assert.strictEqual(response1.status, 400)
  assert(
    response1.body.error.includes('`title` and `url` are required'),
    'Missing error message for missing title',
  )

  const response2 = await api.post('/api/blogs').send(blogWithoutUrl).expect(400)

  assert.strictEqual(response2.status, 400)
  assert(
    response2.body.error.includes('`title` and `url` are required'),
    'Missing error message for missing url',
  )
})

test('a specific blog can be viewed', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const blogToView = blogsAtStart[0]
  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultBlog.body, blogToView)
})

test('a specific blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const blogToDelete = blogsAtStart[0]
  console.log(blogToDelete)

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const titles = blogsAtEnd.map((b) => b.title)

  assert(!titles.includes(blogToDelete.title))

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})

after(async () => {
  await mongoose.connection.close()
})
