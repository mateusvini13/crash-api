const express = require('express')
require('./db/mongoose')

const middleware = {
  cors: require('./middleware/cors')
}

const userRouter = require('./routers/users')
const challengesRouter = require('./routers/challenges')
const pitStopRouter = require('./routers/pitstop')
const placeholderRouter = require('./routers/placeholders')
  

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

//Middleware
app.use(middleware.cors)

//Home page
app.get('/', (req, res) => {
  res.send('WOAH')
})

// app.get('/reddit', function(req, res) {
//   res.contentType('text/plain')
//   res.header('Content-Disposition', 'attachment; filename=name.txt')
//   res.send('Reddit text file test\nLine Break');
// });

app.use(userRouter)
app.use(challengesRouter)
app.use(pitStopRouter)
app.use(placeholderRouter)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})