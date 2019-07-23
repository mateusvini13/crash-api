const mongoose = require('mongoose')

const challengeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  desc: { type: String, required: true, trim: true },
  reward: { type: Number, required: true, trim: true }
})

const Challenge = new mongoose.model('Challenge', challengeSchema)

module.exports = Challenge