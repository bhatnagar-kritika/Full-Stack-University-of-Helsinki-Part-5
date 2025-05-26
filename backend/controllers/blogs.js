const jwt = require('jsonwebtoken')
const blogRouter = require('express').Router()
const middleware = require('../utils/middleware')

const Blog= require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request,response) => {
  const blogs= await Blog.find({}).populate('user',{ username:1, name: 1, id: 1 })
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const blogs= await Blog.findById(request.params.id)
  if(blogs) {
    response.json(blogs)
  }
  else {
    response.status(404).send('Blog not found')
  }
})

blogRouter.post('/', middleware.userExtractor,  async (request, response) => {
  const body = request.body
  const user = request.user
  console.log('the received blog is:',request.body)

  const newBlog= new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await newBlog.save()
  user.blogs= user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)

})

blogRouter.delete('/:id',middleware.userExtractor, async (request, response) => {

  try{  const user = request.user

    console.log('deleting blog with id:', request.params.id)
    console.log('user attempting to delete',user)

    const blogDelete = await Blog.findById(request.params.id)
    // console.log('Blog found:', blogDelete)
    // console.log('blogDelete.user:', blogDelete.user)

    if(!blogDelete) {
      return response.status(404).json({ error:'Blog not found' })
    }

    console.log('Blog found:', blogDelete)

    if(blogDelete.user.toString()!== user._id.toString()) {
      return response.status(403).json({ error: 'This user is not the creator hence cannot delete the blog' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    console.log('Blog deleted successfully')

    return response.status(204).end()}

  catch(error) {
    console.log('Error deleting blog:', error)
    return response.status(500).json({ error: 'Internal server error' })
  }


})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user
  }

  const resultOfUpdatedBlog = await Blog.findByIdAndUpdate(request.params.id,updatedBlog, { new: true, runValidators:true } )
    .populate('user',{ username:1,name:1,id:1 })

  if(!resultOfUpdatedBlog) {
    return response.status(404).json({ error: 'Blog not found' })
  }

  response.status(200).json(resultOfUpdatedBlog)


})

module.exports = blogRouter