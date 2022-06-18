const express = require('express')
const { ObjectId } = require('mongodb')
const router = express.Router()
const Character = require('../models/Character')

// getting all characters (not really needed)
router.get('/all', async (req, res) => {
    try {
        const allCharacters = await Character.find()
        res.json(allCharacters)
    } catch (error) {
        res.status(500).json({ message: err.message })
    }
})

// getting characters by query parameters
// no query params => get all the characters
router.get('/', getCharacter, (req, res) => {
    res.json(res.character)
})

// getting one random character     TODO: TwitchSafeMode
router.get('/random', async (req, res) => {
    try {
        const character = await Character.aggregate().sample(1)   // get one random character from db
        res.json(character)
    } catch (error) {
        res.status(500).json({ message: error.message }) 
    }
})

// creating one character
router.post('/', async (req, res) => {
    // create character object
    const character = new Character({
        name: req.body.name,
        image: req.body.image,
        categories: req.body.categories,
        isTwitchSafe: req.body.isTwitchSafe
    })
    // save character object to server and send response to user
    try {
        const newCharacter = await character.save()
        res.status(201).json(newCharacter)   // status 201 = successfully created object
    } catch (error) {
        res.status(400).json({ message: error.message })     // status 400 = wrong user input
    }
})

// middleware function to getCharacter using query parameters
// no query params => get all the characters
async function getCharacter(req, res, next) {
    let character
    let characterFilter = {}

    // build the filter object with the query parameters 
    for(parameter in req.query) {
        findFilter[parameter] = req.query[parameter]
    }
    
    try {
        character = await Character.find(findFilter)
        if (character == null) {
            return res.status(404).json({ message: "Character not found" })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
    res.character = character
    next()
}


module.exports = router