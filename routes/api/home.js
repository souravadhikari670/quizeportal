const express = require('express')
const router = express.Router()
const passport = require('passport')

const Question = require('../../modal/question')
const Profile = require('../../modal/profile')
//home route

router.get('/',
 passport.authenticate('jwt',{session: false,successRedirect: '/quize/auth/active', failureRedirect: "/api/auth/login"}),
(req, res)=>{
})

router.get('/quize/auth/active',
passport.authenticate('jwt',{session: false,failureRedirect: "/sessionexpire"}), 
(req, res)=>{
   res.render('active')
})



router.get('/sessionexpire',(req, res)=>{
    res.clearCookie('token')
    res.redirect('/api/auth/login')
})
router.post('/logout',(req, res)=>{
    res.clearCookie('token')
    res.redirect('/')
})
module.exports = router