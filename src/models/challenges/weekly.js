const mongoose = require('mongoose')

const Challenge = require('../../models/challenges/challenge')

const weeklySchema = new mongoose.Schema({
  startDate: { type: Date, required: true, default: Date.now() },
  challenges: [Challenge.schema]
})

weeklySchema.pre('save', async function (next) {
  const weekly = this
  
  //Set hours to 00:00:00
  weekly.startDate = weekly.startDate.setUTCHours(0,0,0,0)

  next()
})

const Weekly = new mongoose.model('Weekly', weeklySchema)

module.exports = Weekly
