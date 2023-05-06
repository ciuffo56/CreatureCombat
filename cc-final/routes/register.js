const express = require('express')
const router = express.Router()
const User = require('../models/User')
const notAuth = require('../middleware/not-authenticate')
const bcrypt = require('bcryptjs')

//Register Page

router.get('/', notAuth, (req, res) => {
    res.render('loginAndRegister/register')
})

//Register User

router.post('/', async (req, res) => {
    let user = await User.findOne({ email: req.body.email })

    if(user) { //user with this email already exists
        return res.redirect('register')
    }

    const hashedPass = await bcrypt.hash(req.body.password, 10)

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPass,
        wins: 0,
        losses: 0
    })
    
    await newUser.save()
    res.redirect('login')
})

module.exports = router