const express = require('express')
const auth = require('../../middleware/auth')
const Weekly = require('../../models/challenges/weekly')

const router = new express.Router()

//Add a new list of Weekly Challenges
router.post('/challenges/weekly', auth, async (req, res) => {
  if(req.body.startDate){
    req.body.startDate = new Date(req.body.startDate)
  }
  const newWeekly = new Weekly(req.body)

  try {
    const weekly = await newWeekly.save()
    res.send(weekly)
  } catch (e) {
    res.status(400).send(e)
  }

})

//Get all registered Weekly Challenges. Accepts filters.
router.get('/challenges/weekly', async (req, res) => {

  try {
    const weekly = await Weekly.find(req.query).sort({ startDate: -1 })
    res.send(weekly)
  } catch (e) {
    res.status(500).send(e)
  }
  
})

//Get list of Weekly Challenges by date
router.get('/challenges/weekly/:date', async (req, res) => {

  const maxDate = new Date(req.params.date)
  let minDate = new Date(maxDate)
  minDate = new Date(minDate.setDate(minDate.getDate() - 6))
  
  try {
    const weekly = await Weekly.find({startDate: {"$gte": minDate, "$lte": maxDate}}).sort({ startDate: -1 })
    res.send(weekly)
  } catch (e) {
    res.status(500).send(e)
  }
  
})

//Edit Weekly list
router.patch('/challenges/weekly/:id', auth, async (req, res) => {
  const _id = req.params.id
  const updates = Object.keys(req.body)
  const allowed = ['startDate', 'challenges']
  const isValid = updates.every((update) => allowed.includes(update))

  if(!isValid){
    return res.status(400).send({ message: 'Invalid update operation. Check which values you\'re trying to update and try again.' })
  }

  try {
    const weekly = await Weekly.findById(_id)
    if(!weekly){
      return res.status(404).send()
    }

    updates.forEach((update) => weekly[update] = req.body[update])
    await weekly.save()

    res.send(weekly)
  } catch (e) {
    res.status(500).send(e)
  }
})

//Delete List of Weekly Challenges
router.delete('/challenges/weekly/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    const weekly = await Weekly.findByIdAndDelete(_id)

    if(!weekly){
      return res.status(404).send()
    }

    res.send(weekly)
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router