const express = require('express')
require('./db/mongoose')

const middleware = {
  cors: require('./middleware/cors')
}

const userRouter = require('./routers/users')
const challengesRouter = require('./routers/challenges')
const pitStopRouter = require('./routers/pitStop')
  

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
app.use(challengesRouter)
app.use(pitStopRouter)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})