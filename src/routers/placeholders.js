const express = require('express')
const auth = require('../middleware/auth')
const Placeholder = require('../models/placeholder')

const router = new express.Router()

//Add a new placeholders
router.post('/placeholders', auth, async (req, res) => {
  let newPlaceholders = []
  req.body.map(value => {
    const newPlaceholder = new Placeholder(value)
    newPlaceholders.push(newPlaceholder)
  })

  try {
    const placeholders = await Placeholder.create(newPlaceholders)
    res.send(placeholders)
  } catch (e) {
    res.status(400).send(e)
  }

})

//Get all placeholders of a specific type. Accepts filters.
router.get('/placeholders/:type', async (req, res) => {
  //Add type to query
  req.query.type = req.params.type

  try {
    const placeholders = await Placeholder.find(req.query).sort({ name: 1 })
    res.send(placeholders)
  } catch (e) {
    res.status(500).send(e)
  }
  
})

//Edit Placeholder placeholders
router.patch('/placeholders/:id', auth, async (req, res) => {
  const _id = req.params.id
  const updates = Object.keys(req.body)
  const allowed = ['type', 'name', 'desc', 'reward', 'fields']
  const isValid = updates.every((update) => allowed.includes(update))

  if(!isValid){
    return res.status(400).send({ message: 'Invalid update operation. Check which values you\'re trying to update and try again.' })
  }

  try {
    const placeholders = await Placeholder.findById(_id)
    if(!placeholders){
      return res.status(404).send()
    }

    updates.forEach((update) => placeholders[update] = req.body[update])
    await placeholders.save()

    res.send(placeholders)
  } catch (e) {
    res.status(500).send(e)
  }
})

//Delete placeholders
router.delete('/placeholders/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    const placeholders = await Placeholder.findByIdAndDelete(_id)

    if(!placeholders){
      return res.status(404).send()
    }

    res.send(placeholders)
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router