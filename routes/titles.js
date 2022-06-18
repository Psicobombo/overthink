const express = require('express')
const router = express.Router()
const Title = require('../models/Title')

// getting all titles
router.get('/all', async (req, res) => {
    try {
        const allTitles = await Title.find()
        res.json(allTitles)
    } catch (error) {
        res.status(500).json({ message: err.message })
    }
})

// getting one specific character by id
router.get('/', getTitle, (req, res) => {
    res.json(res.title)
})

// getting one random title     TODO: TwitchSafeMode
router.get('/random', async (req, res) => {
    try {
        const title = await Title.aggregate().sample(1)   // get one random element from db
        res.json(title)
    } catch (error) {
        res.status(500).json({ message: error.message }) 
    }
})

// creating one title
router.post('/', async (req, res) => {
    // create title object
    const character = new Title({
        // TODO: insert here title properties
    })
    // save title object to server and send response to user
    try {
        const newTitle = await title.save()
        res.status(201).json(newTitle)   // status 201 = successfully created object
    } catch (error) {
        res.status(400).json({ message: error.message })     // status 400 = wrong user input
    }
})

// middleware function to getTitle using query parameters
// no query params => get all the titles
async function getTitle(req, res, next) {
    let title
    let findFilter = {}

    // build the filter object with the query parameters 
    for(parameter in req.query) {
        findFilter[parameter] = req.query[parameter]
    }
    
    try {
        title = await Title.find(findFilter)
        if (title == null) {
            return res.status(404).json({ message: "Title not found" })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
    res.title = title
    next()
}


module.exports = router