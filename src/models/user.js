const mongoose = require('mongoose')

const secret = process.env.SECRET || 'supersecretsecret'

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const validator = require('validator')

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true }
})

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, validate(value) {
      if(!validator.isEmail(value)){
        throw new Error('Please, provide a valid email address')
      }
    }
  },
  password: { type: String, required: true, select: false, trim: true, validate(value){
      if(value.length < 6){
        throw new Error('The password must be 6 characters or longer')
      }
    }
  },
  role: { type: String, required: true, default: 'player' },
  tokens: [tokenSchema]
})

userSchema.pre('save', async function (next) {
  const user = this

  //Prevent online users from creating Admins
  user.role = 'player'

  //Encrypt Password
  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

//Generate Token
userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = await jwt.sign({ _id: user._id.toString() }, secret )

  user.tokens = user.tokens.concat({ token })
  await user.save()

  return token
}

//Login user
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email }).select('+password')

  if(!user){
    throw new Error('Unable to login. Invalid credentials.')
  }

  const correctPassword = await bcrypt.compare(password, user.password)
  if(!correctPassword){
    throw new Error('Unable to login. Invalid credentials.')
  }

  return user
}

userSchema.methods.toJSON = function() {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject
}

const User = new mongoose.model('User', userSchema)

module.exports = User