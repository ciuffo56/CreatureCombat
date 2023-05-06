const express = require('express')
const router = express.Router()
const isAuth = require('../middleware/user-authenticate')
const User = require('../models/User')
const path = require('path')
const fs = require('fs')

//Retrieving Animal Data
const filePath = path.join(__dirname, '../animalData/animals.json')
const fileContent = fs.readFileSync(filePath, 'utf-8')
const animalData = JSON.parse(fileContent)

//Welcome
router.get('/', isAuth, async (req, res) => {
    const user = await User.findOne({ username: req.session.username })
    res.render('index', {
        name: req.session.username,
        wins: user.wins,
        losses: user.losses
    })
})

//Start Battle
router.post('/', async (req, res) => {
    //Initialize Animals
    let userAnimal1 = await animalData[Math.floor(Math.random() * animalData.length)]
    let userAnimal2 = await animalData[Math.floor(Math.random() * animalData.length)]
    let cpuAnimal1 = await animalData[Math.floor(Math.random() * animalData.length)]
    let cpuAnimal2 = await animalData[Math.floor(Math.random() * animalData.length)]

    //Save Necessary Values to Session
    req.session.userAnimal1 = userAnimal1
    req.session.userAnimal2 = userAnimal2
    req.session.cpuAnimal1 = cpuAnimal1
    req.session.cpuAnimal2 = cpuAnimal2

    req.session.turnCount = 1
    req.session.gameOver = 0

    res.redirect('/battle')
})

//Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err
        res.redirect('login')
    })
})

module.exports = router