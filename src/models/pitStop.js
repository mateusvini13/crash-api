const mongoose = require('mongoose')

const pitStopSchema = new mongoose.Schema({
  season: { type: Number, required: true, trim: true },
  date: { type: Date, required: true, default: new Date() },
  img: { type: String, required: true, validate(value){
    if(!value.toLowerCase().includes('.jpg') && !value.toLowerCase().includes('.png') && !value.toLowerCase().includes('.jpeg')){
      throw new Error(`The img link must point to a file in the formats .jpg or .png`)
    }
  }}
})

const PitStop = new mongoose.model('PitStop', pitStopSchema)

module.exports = PitStop