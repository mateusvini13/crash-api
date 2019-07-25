const mongoose = require('mongoose')

const Challenge = require('../../models/challenges/challenge')

const themedSchema = new mongoose.Schema({
  season: { type: Number, required: true, trim: true },
  theme: { type: String, trim: true },
  startDate: { type: Date, default: new Date() },
  challenges: [Challenge.schema]
})

themedSchema.pre('save', function (next) {
  const themed = this

  //Set hours to 00:00:00
  if(themed.isModified('startDate')){
    themed.startDate = themed.startDate.setUTCHours(0,0,0,0)
  }

  next()
})

const Themed = new mongoose.model('Themed', themedSchema)

module.exports = Themed