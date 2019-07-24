const express = require('express')
const auth = require('../middleware/auth')
const User = require('../models/user')

const router = new express.Router()

//Add user
router.post('/users', async (req, res) => {
  const newUser = new User(req.body)

  try{
    const user = await newUser.save()
    const token = await user.generateAuthToken()

    res.status(201).send({ user, token })
  } catch (e) {
    res.status(400).send(e)
  }
})

//Login
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (e) {
    res.status(400).send(e)
  }

})

//Get my User data
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})

//Logout
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens.filter(token => {
      return token.token !== req.token
    })
    await req.user.save()

    res.send({ message: 'User logged out successfully'})
  } catch (e) {
    res.status(500).send(e)
  }
})

//Logout All
router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()

    res.send()
  } catch (e) {
    res.status(500).send(e)
  }
})

//Edit User
router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowed = ['name', 'email', 'password']
  const isValid = updates.every((value) => allowed.includes(value))

  if(!isValid){
    return res.status(404).send({error: 'Invalid update operation. Check which values you\'re trying to update and try again.'})
  }

  try {
    updates.forEach((update) => req.user[update] = req.body[update])
    await req.user.save()
    res.send(req.user)
  } catch (e) {
    res.status(500).send(e)
  }
})

//Delete user
router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove()
    res.send(req.user)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router