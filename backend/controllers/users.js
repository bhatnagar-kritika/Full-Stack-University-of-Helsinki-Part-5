const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.post('/', async(request, response) => {
  const { username, name, password } = request.body

  if(!password || password.length< 3) {
    return response.status(400).json({
      error: 'Password must have atleast 3 characters'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password,saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async(request, response) => {

  const user = await User.find({}).populate('blogs',{ title:1, author:1, url:1, likes: 1 })

  if(user) {
    response.json(user)
  }

  else {
    response.json(404).send('Users not found')
  }

})

usersRouter.put('/:id', async(request, response) => {

  const { password } = request.body

  if(!password || password.length<3) {
    return response.status(400).json({
      error: 'Password must have atleast 3 characters'
    })
  }

  const saltRounds = 10
  const passwordHash= await bcrypt.hash(password,saltRounds)

  const updatedUser = await User.findByIdAndUpdate(request.params.id, { passwordHash }, { new:true, runValidators: true })

  if(!updatedUser){
    return response.status(404).json({ error: 'User not found' })
  }

  response.status(200).json(updatedUser)

})

module.exports = usersRouter