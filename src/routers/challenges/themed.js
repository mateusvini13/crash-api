const express = require('express')
const auth = require('../../middleware/auth')
const Themed = require('../../models/challenges/themed')

const router = new express.Router()

//Adds a new list of Themed Challenges
router.post('/challenges/themed', auth, async (req, res) => {
  if(req.body.startDate){
    req.body.startDate = new Date(req.body.startDate)
  }
  const newThemed = new Themed(req.body)

  try {
    const themed = await newThemed.save()
    res.send(themed)
  } catch (e) {
    res.status(400).send(e)
  }

})

//Get lists of Themed Challenges. Can filter by Season or startDate
router.get('/challenges/themed', async (req, res) => {

  try {
    const themed = await Themed.find(req.query).sort({ season: -1 })
    res.send(themed)
  } catch (e) {
    res.status(500).send(e)
  }
  
})

//Edit list of Themed Challenges
router.patch('/challenges/themed/:id', auth, async (req, res) => {
  const _id = req.params.id
  const updates = Object.keys(req.body)
  const allowed = ['startDate', 'season', 'theme', 'challenges']
  const isValid = updates.every((update) => allowed.includes(update))

  if(!isValid){
    return res.status(400).send({ message: 'Invalid update operation. Check which values you\'re trying to update and try again.' })
  }
  
  try {
    const themed = await Themed.findById(_id)
    if(!themed){
      res.status(404).send()
    }

    updates.forEach((update) => themed[update] = req.body[update])
    await themed.save()

    res.send(themed)
  } catch (e) {
    res.status(500).send(e)
  }
})

//Delete list of themed challenges
router.delete('/challenges/themed/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    const themed = await Themed.findByIdAndDelete(_id)

    if(!themed){
      return res.status(404).send()
    }

    res.send(themed)
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router