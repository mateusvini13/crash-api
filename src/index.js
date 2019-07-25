const express = require('express')
require('./db/mongoose')

const secret = process.env.SECRET || 'supersecretsecret'
const middleware = {
  cors: require('./middleware/cors')
}

const userRouter = require('./routers/users')
const challengeTypes = [
  { name: 'themed', router: require('./routers/challenges/themed') },
  { name: 'weekly', router: require('./routers/challenges/weekly') }
]
  

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

//Middleware
app.use(middleware.cors)

//Home page
app.get('/', (req, res) => {
  res.send('WOAH')
})

app.use(userRouter)

//Create a router for each challenge type
challengeTypes.map((type) => {
  app.use(type.router)
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})