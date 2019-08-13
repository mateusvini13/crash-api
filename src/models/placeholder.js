const mongoose = require('mongoose')

const placeholderSchema = new mongoose.Schema({
  type: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  desc: { type: String, required: true, trim: true },
  reward: { type: Number, required: true, trim: true },
  fields: { type: [String], trim: true }
})

const Placeholder = new mongoose.model('Placeholder', placeholderSchema)

module.exports = Placeholder