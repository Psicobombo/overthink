const express = require('express')
const router = express.Router()
const Modifier = require('../models/modifier')

// getting all modifiers
router.get('/', async (req, res) => {
    try {
        const allModifiers = await Modifier.find()
        res.json(allModifiers)

    } catch (error) {
        res.status(500).json({ message: err.message })

    }

})

// getting one specific modifier by id
router.get('/:id', getModifier, (req, res) => {
    res.json(res.modifier)
})

// getting one random modifier     TODO: TwitchSafeMode
router.get('/', async (req, res) => {
    try {
        const modifier = await Modifier.aggregate([{$sample:{size:1}}])   // get one random modifier from db
        res.json(modifier)
    } catch (error) {
        res.status(500).json({ message: error.message }) 
    }
})

// creating one modifier
router.post('/', async (req, res) => {
    // create modifier object
    const modifier = new Modifier({
        label: req.body.label,
        isTwitchSafe: req.body.isTwitchSafe
    })
    // save modifier object to server and send response to user
    try {
        const newModifier = await modifier.save()
        res.status(201).json(newModifier)   // status 201 = successfully created object
    } catch (error) {
        res.status(400).json({ message: error.message })     // status 400 = wrong user input

    }


})

// middleware function to getModifier by id
async function getModifier(req, res, next) {
    let modifier
    try {
        modifier = await Modifier.findById(req.params.id)
        if (modifier == null) {
            return res.status(404).json({ message: "Modifier not found" })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
    res.modifier = modifier
    next()
}


module.exports = router