const { test, after, beforeEach, describe } = require('node:test')
const assert= require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { ObjectId } = require('mongoose').Types //import to create an object id that mongoose accepts

const api=supertest(app)

const helper = require('./blogsListTestHelper')
const Blog= require('../models/blog')
const User = require('../models/user')
const { pick } = require('lodash')
const { application } = require('express')

beforeEach(async() => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const user = await helper.createInitialUser()

  const blogsWithUser = helper.completeBlogList.map(blog => ({
    ...blog,
    user: user._id
  }))

  const insertedBlogs = await Blog.insertMany(blogsWithUser)

  user.blogs = insertedBlogs.map(blog => blog._id)

  await user.save()
})

test('There are 6 blogs in the bloglist and blog posts are returned in the json format', async () => {
  const response= await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type',/application\/json/)
  console.log('blogs response:',response.body)
  assert.strictEqual(response.body.length,6)

})

test('To check if the unique identifier is id', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)

  response.body.forEach(blog => {
    assert.strictEqual(Object.keys(blog).includes('id'), true)
  })
})

test('Making an HHTP POST request successfully creates a new blog post', async () => {

  const token = await helper.getToken()

  const newBlogPost = {
    'title': 'Best selling boks 2024',
    'author': 'Veena Kalin',
    'url': 'http:Alwaysreading.com',
    'likes': 24
  }

  const blogBeforeUpdate = await Blog.find({})

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlogPost)
    .expect(201)

  const blogAfterUpdate = await Blog.find({})

  assert.strictEqual(blogAfterUpdate.length, blogBeforeUpdate.length+1)
  console.log('blog added was:',response.body)

  assert.strictEqual(response.body.title, newBlogPost.title)
  assert.strictEqual(response.body.author,newBlogPost.author)
  assert.strictEqual(response.body.url, newBlogPost.url)
  assert.strictEqual(response.body.likes, newBlogPost.likes)
})

test('Adding a new blog fails with status 401 if token is not provided', async() => {
  const newBlogPost = {
    'title': 'Best selling boks 2024',
    'author': 'Veena Kalin',
    'url': 'http:Alwaysreading.com',
    'likes': 24
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlogPost)
    .expect(401)

  assert.strictEqual(response.body.error, 'Token is missing')
})

test('If the likes property is missing from the request, it will default to the value 0', async () => {

  const token = await helper.getToken()
  const newBlogPost = {
    'title': 'Finance 101',
    'author': 'Zoe Flanel',
    'url': 'http:financeencyclopedia.com'
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization',`Bearer ${token}`)
    .send(newBlogPost)
    .expect(201)

  console.log('Like should be 0 in the response', response.body)

  assert.strictEqual(response.body.likes, 0)
})

describe( 'If the title or url properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request',() => {

  test('If the title is missing', async () => {
    const token = await helper.getToken()

    const newBlogPost ={
      'author': 'Veena Kalin',
      'url': 'http:Alwaysreading.com',
      'likes': 24
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogPost)
      .expect(400)

    assert.strictEqual(response.status,400)
  })

  test('If the url is missing', async () => {
    const token = await helper.getToken()

    const newBlogPost = {
      'title': 'Best selling boks 2024',
      'author': 'Veena Kalin',
      'likes': 24
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization',`Bearer ${token}`)
      .send(newBlogPost)
      .expect(400)

    assert.strictEqual(response.status,400)
  })

  test('If both url and title are missing', async () => {
    const token = await helper.getToken()

    const newBlogPost = {
      'author': 'Veena Kalin',
      'likes': 24
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogPost)
      .expect(400)

    assert.strictEqual(response.status,400)
  })

})

describe('Testing the delete functionality', () => {
  test('Delete a blog entry', async () => {

    const token = await helper.getToken()

    const blogBeforeDelete = await Blog.find({})

    const blogToDelete = blogBeforeDelete[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization',`Bearer ${token}`)
      .expect(204)

    const blogAfterDelete = await Blog.find({})

    assert.strictEqual(blogBeforeDelete.length-1,blogAfterDelete.length )

    const blogCheckAfterDelete = blogAfterDelete.some(blog => blog.id===blogToDelete.id)
    assert.strictEqual(blogCheckAfterDelete,false)

  })

  test('try to delete a non existing blog', async () => {
    const token = await helper.getToken()
    const nonExistingId = new ObjectId()

    console.log('Object id is:',nonExistingId)

    const response = await api
      .delete(`/api/blogs/${nonExistingId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)

    assert.strictEqual(response.status,404)
    assert.strictEqual(response.body.error,'Blog not found')
  })
})

describe('Testing the functionality of updating blogs', () => {
  test('Updating the likes of blogs', async () => {

    const blogsBeforeUpdate = await Blog.find({})

    const randomIndex = Math.floor(Math.random()*blogsBeforeUpdate.length)
    console.log('random index is',randomIndex)
    const randomBlog= blogsBeforeUpdate[randomIndex]
    console.log('random blog is',randomBlog)

    const updatedLikes = randomBlog.likes+1

    const response = await api
      .put(`/api/blogs/${randomBlog.id}`)
      .send({ likes: updatedLikes })
      .expect(200)

    const updatedBlog = response.body
    console.log('Blog after updated likes', updatedBlog)
    assert.strictEqual(updatedBlog.likes, updatedLikes)
  })
})

describe('Testing the addition of new user:Username and password are mandatory and must be 3 characters long, username must be unique', () => {

  test('Username must be 3 characters long:', async() => {

    const newUser = {
      'username': 'zo',
      'name': 'Zoe',
      'password': 'fun'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    console.log('username length error is', response.error)
    assert.strictEqual(response.status, 400)
    // assert.strictEqual(response.error.name, 'validation error')
  })

  test('username is mandatory ', async() => {
    const newUser = {
      'name': 'Zoe',
      'password': 'fun'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    console.log('Username mandatory error is', response.error)

    assert.strictEqual(response.status, 400)
  })

  test('password must be atleast 3 characters long', async() => {
    const newUser = {
      'username': 'zoe7',
      'name': 'Zoe',
      'password': 'ye'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.strictEqual(response.status, 400)
  })

  test('password is mandatory', async () => {
    const newUser = {
      'username': 'zoe7',
      'name': 'Zoe',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.strictEqual(response.status, 400)
  })
})

test('username must be unique', async() => {

  const usersBefore = await User.find({})
  const newUser = {
    'username': 'root',
    'name': 'zoe',
    'password': 'funny'
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const updatedUsers = await User.find({})

  assert.strictEqual(response.status, 400)
  assert.strictEqual(usersBefore.length, updatedUsers.length)
})

after(async () => {
  await mongoose.connection.close()
})