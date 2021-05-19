const express = require('express')
const userRouter = require('./routes/user')
const storyRouter = require('./routes/stories')
const port = process.env.PORT
const db = require('./db/db');

db.connectToDb();

const app = express()

app.use(express.json())
app.use(userRouter)
app.use('/stories', storyRouter)

app.listen(port, () => {
   console.log(`Server running on port ${port}`)
})

process.on('exit', () => {
   db.disconnectFromDb();
});
