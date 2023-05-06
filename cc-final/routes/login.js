const express = require('express')
const router = express.Router()
const User = require('../models/User')
const notAuth = require('../middleware/not-authenticate')
const bcrypt = require('bcryptjs')

//Login Page

router.get('/', notAuth, (req, res) => {
    res.render('loginAndRegister/login')
})

//User Login

router.post('/', async (req, res) => {
    console.log(req.body.username)
    const user = await User.findOne({ username: req.body.username })
    console.log(user)

    if (!user) {
        res.redirect('login')
    }

    const passMatch = await bcrypt.compare(req.body.password, user.password)

    if (!passMatch) {
        res.redirect('login')
    }

    req.session.isAuth = true
    req.session.username = req.body.username
    res.redirect('/')
})

module.exports = router