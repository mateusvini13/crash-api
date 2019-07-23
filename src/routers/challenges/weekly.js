const express = require('express')
const Weekly = require('../../models/challenges/weekly')

const router = new express.Router()

//Add a new list of Weekly Challenges
router.post('/challenges/weekly', async (req, res) => {
  const newWeekly = new Weekly(req.body)

  try {
    const weekly = await newWeekly.save()
    res.send(weekly)
  } catch (e) {
    res.status(500).send(e)
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

module.exports = router