const express = require('express')
const mongoose = require('mongoose');
require('dotenv').config()


async function connectToDatabase() {

await mongoose.connect(
    `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@overthink-frankfurt.oq9mjyt.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`,
    () => {
        console.log("Database connected")
    },
    e => console.error(e))
}

connectToDatabase()

const Character = require('./Character')

const newCharacter = new Character({
    name: "Pino Daniele",
    image: "URLIMG",
    categories: ["italia", "musica"],
    isTwitchSafe: true
})


async function addCharacter(character) {
    await character.save()
    console.log("Added: " + character)
}


const app = express();

app.listen(3000, () => console.log("Listening at 3000"))

app.use(express.static('public'))
app.use(express.json({limit: '1mb'}))


app.get('/api/character', (req, res) => {
    

    const character = {
        name: "Francesco Totti",
        url: "pesceURLpesceURL",
        isTwitchSafe: true
    }


    res.json(character)
})