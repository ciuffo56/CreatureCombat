const express = require('express')
const router = express.Router()
const User = require('../models/User')
const isAuth = require('../middleware/user-authenticate')

//Leaderboard
router.get('/', isAuth, async (req, res) => {
    let search = {}
    if (req.query.search != null && req.query.search !== '') {
        search.username = new RegExp(req.query.search, 'i')
    }
    try {
        let users = await User.find(search)
        console.log(users)
        users.sort(compareFnLB)
        console.log(users)
        res.render('winLoss/index', {
        users: users,
        search: req.query
        })
    } catch (e){
        console.log(e)
        res.redirect('/')
    }
})

//Win Page
router.get('/win', isAuth, (req, res) => {
    res.render('winLoss/win')
})

//Loss Page
router.get('/loss', isAuth, (req, res) => {
    res.render('winLoss/loss')
})

//-----Functions-----
function compareFnLB(a, b) {
    if (b.wins < a.wins) {
        return -1
    }
    if (b.wins > a.wins) {
        return 1
    }
    if (a.losses < b.losses) {
        return -1
    }
    if (a.losses > b.losses) {
        return 1
    }
    return 0
}

module.exports = router