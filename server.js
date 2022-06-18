const express = require('express')
const app = express();
app.use(express.static('public'))
app.use(express.json({limit: '1mb'}))
const mongoose = require('mongoose');
require('dotenv').config()

// models (= collections in db)
const Character = require('./models/Character')
const Modifier = require('./models/Modifier')
const Title = require('./models/Title')

// initialize .env variables
const DATABASE_USER = process.env.DATABASE_USER
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD
const DATABASE_NAME = process.env.DATABASE_NAME
const PORT = process.env.PORT || 3000


mongoose.connect(`mongodb+srv://${DATABASE_USER}:${DATABASE_PASSWORD}@overthink-frankfurt.oq9mjyt.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority`)


// event fires on database successfully connected
mongoose.connection.once("connected", () => {
    console.info("Connected to Database")
    app.listen(PORT, () => console.info(`Server running at port ${PORT}`))
})

//event fires on database connection error
mongoose.connection.on("error", (e) => console.error(e))

// initialize Routers for the API
const characterRouter = require('./routes/characters')
app.use('/api/characters', characterRouter)
const modifierRouter = require('./routes/modifiers')
app.use('/api/modifiers', modifierRouter)
const titleRouter = require('./routes/titles')
app.use('/api/titles', titleRouter)

