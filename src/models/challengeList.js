const mongoose = require('mongoose')

const Challenge = require('./challenge')

const challengeListSchema = new mongoose.Schema({
  type: { type: String, required: true, trim: true },
  season: { type: Number, required: true, trim: true },
  theme: { type: String, trim: true },
  date: { type: Date, required: true, default: new Date() },
  challenges: [Challenge.schema]
})

challengeListSchema.pre('save', function (next) {
  const challengeList = this

  //Set hours to 00:00:00
  if(challengeList.isModified('date')){
    challengeList.date = challengeList.date.setUTCHours(0,0,0,0)
  }

  next()
})

const ChallengeList = new mongoose.model('ChallengeList', challengeListSchema)

module.exports = ChallengeList