const express = require('express')
const router = express.Router()
const Modifier = require('../models/Modifier')

// getting all modifiers
router.get('/all', async (req, res) => {
    try {
        const allModifiers = await Modifier.find()
        res.json(allModifiers)
    } catch (error) {
        res.status(500).json({ message: err.message })
    }
})

// getting modifiers by query parameters
// no query params => get all the modifiers
router.get('/', getModifier, (req, res) => {
    res.json(res.modifier)
})


// getting one random modifier     TODO: TwitchSafeMode
router.get('/random', async (req, res) => {
    try {
        let findFilter = {}
        if (req.query.twitchSafeMode === true) {findFilter.isTwitchSafe = true}
        const modifier = await Modifier.aggregate().match(findFilter).sample(1)   // get one random element from db
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

// middleware function to getModifier using query parameters
// no query params => get all the modifiers
async function getModifier(req, res, next) {
    let modifier
    let findFilter = {}

    // build the filter object with the query parameters 
    for(parameter in req.query) {
        findFilter[parameter] = req.query[parameter]
    }
    
    try {
        modifier = await Modifier.find(findFilter)
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