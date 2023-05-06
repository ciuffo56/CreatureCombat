const express = require('express')
const router = express.Router()
const isAuth = require('../middleware/user-authenticate')

//Win Page
router.get('/win', isAuth, (req, res) => {
    res.render('winLoss/win')
})

//Loss Page
router.get('/loss', isAuth, (req, res) => {
    res.render('winLoss/loss')
})

module.exports = router