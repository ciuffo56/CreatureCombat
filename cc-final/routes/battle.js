const express = require('express')
const router = express.Router()
const User = require('../models/User')
const isAuth = require('../middleware/user-authenticate')



//Battle Page
router.get('/', isAuth, async (req, res) => {
    res.render('battle/battle', {
        uA1: req.session.userAnimal1,
        uA2: req.session.userAnimal2,
        cA1: req.session.cpuAnimal1,
        cA2: req.session.cpuAnimal2,
        turnCount: req.session.turnCount
    })
})

router.post('/', async (req, res) => {
    console.log('Attack Stage Starting')

    
    //Instantiate Attack Variables
    let uAtk1
    let uAtk2
    let uTD1
    let uTD2
    let cAtk1
    let cAtk2
    let cTD1
    let cTD2

    //First User Animal Attack
    switch(req.body.uA1Attack) {
        case '1':
            uAtk1 = req.session.userAnimal1.atk1
            break
        case '2':
            uAtk1 = req.session.userAnimal1.atk2
            break
        case '3':
            uAtk1 = req.session.userAnimal1.atk3
            break
        case '4':
            uAtk1 = req.session.userAnimal1.atk4
            break
        default:
            res.redirect('/')
    }
    
    //Second User Animal Attack
    switch(req.body.uA2Attack) {
        case '1':
            uAtk2 = req.session.userAnimal2.atk1
            break
        case '2':
            uAtk2 = req.session.userAnimal2.atk2
            break
        case '3':
            uAtk2 = req.session.userAnimal2.atk3
            break
        case '4':
            uAtk2 = req.session.userAnimal2.atk4
            break
        default:
            res.redirect('/')
    }

    //First User Animal Target
    switch(req.body.uA1Target) {
        case '1':
            uTD1 = req.session.cpuAnimal1
            break
        case '2':
            uTD1 = req.session.cpuAnimal2
            break
        default:
            res.redirect('/')
    }

    //Second User Animal Target
    switch(req.body.uA2Target) {
        case '1':
            uTD2 = req.session.cpuAnimal1
            break
        case '2':
            uTD2 = req.session.cpuAnimal2
            break
        default:
            res.redirect('/')
    }

    //Generates CPU attack and targets
    let cAtk1Raw = Math.floor(Math.random() * 4) + 1
    let cTD1Raw = Math.floor(Math.random() * 2) + 1
    let cAtk2Raw = Math.floor(Math.random() * 4) + 1
    let cTD2Raw = Math.floor(Math.random() * 2) + 1

    //First CPU Animal Attack
    switch(cAtk1Raw) {
        case 1:
            cAtk1 = req.session.cpuAnimal1.atk1
            break
        case 2:
            cAtk1 = req.session.cpuAnimal1.atk2
            break
        case 3:
            cAtk1 = req.session.cpuAnimal1.atk3
            break
        case 4:
            cAtk1 = req.session.cpuAnimal1.atk4
            break
        default:
            res.redirect('/')
    }
    
    //Second User Animal Attack
    switch(cAtk2Raw) {
        case 1:
            cAtk2 = req.session.cpuAnimal2.atk1
            break
        case 2:
            cAtk2 = req.session.cpuAnimal2.atk2
            break
        case 3:
            cAtk2 = req.session.cpuAnimal2.atk3
            break
        case 4:
            cAtk2 = req.session.cpuAnimal2.atk4
            break
        default:
            res.redirect('/')
    }

    //First Animal Target
    switch(cTD1Raw) {
        case 1:
            cTD1 = req.session.userAnimal1
            break
        case 2:
            cTD1 = req.session.userAnimal2
            break
        default:
            res.redirect('/')
    }

    //Second Animal Target
    switch(cTD2Raw) {
        case 1:
            cTD2 = req.session.userAnimal1
            break
        case 2:
            cTD2 = req.session.userAnimal2
            break
        default:
            res.redirect('/')
    }

    //Create an array of this round's animal data
    const attacks = [
        { animal: req.session.userAnimal1, attack: uAtk1, target: uTD1 },
        { animal: req.session.userAnimal2, attack: uAtk2, target: uTD2 },
        { animal: req.session.cpuAnimal1, attack: cAtk1, target: cTD1 },
        { animal: req.session.cpuAnimal2, attack: cAtk2, target: cTD2 }
    ]

    //Sort the animals by speed in descending order
    attacks.sort((a, b) => b.attack.spd - a.attack.spd)

    //Perform each attack in order of speed
    attacks.forEach( async (animal) => {
        //Check if animal is still alive
        if(animal.animal.hp <= 0){
            console.log(`${animal.animal.name} is aleady dead and cannot attack`);
            return;
        }
        //Check if the target is still alive
        if (animal.target.hp <= 0) {
            console.log(`${animal.target.name} is already knocked out!`);
            return;
        }
   
        //Subtract the damage from the target's health
        switch(animal.target.name) {
            case req.session.userAnimal1.name:
                req.session.userAnimal1.hp -= animal.attack.pwr
                break
            case req.session.userAnimal2.name:
                req.session.userAnimal2.hp -= animal.attack.pwr
                break
            case req.session.cpuAnimal1.name:
                req.session.cpuAnimal1.hp -= animal.attack.pwr
                break
            case req.session.cpuAnimal2.name:
                req.session.cpuAnimal2.hp -= animal.attack.pwr
                break
            default:
                console.log('broke!!!')
        }
   
        console.log(`${animal.animal.name} used ${animal.attack.name} on ${animal.target.name} and dealt ${animal.attack.pwr} damage!`);
        console.log(`${animal.target.name} Health reduced to ${animal.target.hp}`);
        
        //Check if the target has been knocked out
        if (animal.target.hp <= 0) {
            console.log(`${animal.target.name} has been knocked out!`)
        }
        //Checking Win
        if(req.session.cpuAnimal1.hp <= 0 && req.session.cpuAnimal2.hp <= 0){
            req.session.gameOver = 1
            const user = await User.findOneAndUpdate(
                { username: req.session.username },
                { $inc: { wins: 1 } })
            console.log(`Game Over! You Win!`)
            //res.redirect('winLoss/win')
            }
        //Checking Loss
        if(req.session.userAnimal1.hp <= 0 && req.session.userAnimal2.hp <= 0){
            req.session.gameOver = 2
            const user = await User.findOneAndUpdate(
                { username: req.session.username },
                { $inc: { losses: 1 } })
            console.log(`Game over! CPU wins!`)
            //res.redirect('winLoss/loss')
        }
    })
    if (req.session.gameOver == 1) {
        return res.redirect('winLoss/win')
    } else if(req.session.gameOver == 2) {
        return res.redirect('winLoss/loss')
    }
    console.log(req.session.gameOver)

    req.session.turnCount++
    res.redirect('battle')
})

module.exports = router