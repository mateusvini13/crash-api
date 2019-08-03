const express = require('express')
const auth = require('../middleware/auth')
const PitStop = require('../models/pitStop')

const router = new express.Router()

//add new pitstop item
router.post('/pitstop', auth, async (req, res) => {
  if(req.body.date){
    req.body.date = new Date(req.body.date)
  }
  const newPitStop = new PitStop(req.body)

  try {
    const pitstop = await newPitStop.save()
    res.send(pitstop)
  } catch (e) {
    res.status(400).send(e)
  }
})

//Get pit stop item
router.get('/pitstop', async (req, res) => {
  let resultLimit = 30

  try {
    const pitstop = await PitStop.find(req.query).sort({ date: -1 }).limit(resultLimit)
    res.send(pitstop)
  } catch (e) {
    res.status(500).send(e)
  }

})

//Edit pit stop item
router.patch('/pitstop/:id', auth, async (req, res) => {
  const _id = req.params.id
  const updates = Object.keys(req.body)
  const allowed = [ 'date', 'season', 'img' ]
  const isAllowed = updates.every((update) => allowed.includes(update))

  if(!isAllowed){
    return res.status(400).send({ message: 'Invalid update operation. Check which values you\'re trying to update and try again.' })
  }

  try {
    const pitstop = await PitStop.findById(_id)
    if(!pitstop){
      return res.status(404).send()
    }

    updates.forEach((update) => pitstop[update] = req.body[update])
    await pitstop.save()

    res.send(pitstop)
  } catch (e) {
    res.status(500).send(e)
  }
})

//Delete pit stop item
router.delete('/pitstop/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    const pitstop = await PitStop.findByIdAndDelete(_id)

    if(!pitstop){
      return res.status(404).send()
    }

    res.send(pitstop)
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router