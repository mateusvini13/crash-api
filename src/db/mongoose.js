const mongoose = require('mongoose')

const uristring = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crash-api'

mongoose.connect(`${uristring}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
})