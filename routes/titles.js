const express = require('express')
const router = express.Router()
const Character = require('../models/character')

// getting all characters
router.get('/', async (req, res) => {
    try {
        const allCharacters = await Character.find()
        res.json(allCharacters)
    } catch (error) {
        res.status(500).json({ message: err.message })
    }
})

// getting one specific character by id
router.get('/:id', getCharacter, (req, res) => {
    res.json(res.character)
})

// getting one random character     TODO: TwitchSafeMode
router.get('/', async (req, res) => {
    try {
        const character = await Character.aggregate([{$sample:{size:1}}])   // get one random character from db
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

// middleware function to getCharacter by id
async function getCharacter(req, res, next) {
    let character
    try {
        character = await Character.findById(req.params.id)
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