const express = require('express')
const auth = require('../middleware/auth')
const ChallengeList = require('../models/challengeList')

const router = new express.Router()

//Add a new list of challenges
router.post('/challenges', auth, async (req, res) => {
  if(req.body.date){
    req.body.date = new Date(req.body.date)
  }
  const newChallengeList = new ChallengeList(req.body)

  try {
    const list = await newChallengeList.save()
    res.send(list)
  } catch (e) {
    res.status(400).send(e)
  }

})

//Get all challenges of a specific type. Accepts filters.
router.get('/challenges/:type', async (req, res) => {
  let resultLimit = 30

  //Add type to query
  req.query.type = req.params.type

  //If searching for Weekly, create a date range according to the provided date
  if(req.query.date){
    if(req.params.type == 'quick'){
      resultLimit = 1
      const maxDate = new Date(req.query.date)
      req.query.date = {"$lte": maxDate}
    }

    if(req.params.type == 'weekly'){
      const maxDate = new Date(req.query.date)
      let minDate = new Date(maxDate)
      minDate = new Date(minDate.setDate(minDate.getDate() - 6))
      req.query.date = {"$gte": minDate, "$lte": maxDate}
    }
  }

  try {
    const list = await ChallengeList.find(req.query).sort({ date: -1 }).limit(resultLimit)
    res.send(list)
  } catch (e) {
    res.status(500).send(e)
  }
  
})

//Edit ChallengeList list
router.patch('/challenges/:id', auth, async (req, res) => {
  const _id = req.params.id
  const updates = Object.keys(req.body)
  const allowed = ['season', 'theme', 'type', 'date', 'challenges']
  const isValid = updates.every((update) => allowed.includes(update))

  if(!isValid){
    return res.status(400).send({ message: 'Invalid update operation. Check which values you\'re trying to update and try again.' })
  }

  try {
    const list = await ChallengeList.findById(_id)
    if(!list){
      return res.status(404).send()
    }

    updates.forEach((update) => list[update] = req.body[update])
    await list.save()

    res.send(list)
  } catch (e) {
    res.status(500).send(e)
  }
})

//Delete List of challenges
router.delete('/challenges/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    const list = await ChallengeList.findByIdAndDelete(_id)

    if(!list){
      return res.status(404).send()
    }

    res.send(list)
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router