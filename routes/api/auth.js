const express = require('express')
const router = express.Router()
const bcryptjs = require('bcryptjs')
const jsonwt = require('jsonwebtoken')
const mySecretkey = require('../../key/database').secret

//bring required Schema
const Profile = require('../../modal/profile')

//Register Route
router.get('/register', (req, res)=>{
    res.render('register')
})
//login Route
router.get('/login', (req, res)=>{
    res.render('login')
})

//post route
//register route
router.post('/register',(req, res)=>{
    Profile.findOne({email: req.body.email})
    .then((profile)=>{
        if(! profile){
            const newUser = new Profile({
                name: req.body.name,
                uid: req.body.id,
                email: req.body.email,
                password: req.body.password
            })
            //encrypt password
            bcryptjs.genSalt(10, function(error,salt){
                bcryptjs.hash(newUser.password, salt, (error, hash)=>{
                    if(error) throw error
                    newUser.password = hash
                    newUser.save()
                    .then((profile)=>{
                        const data = {
                            id: profile._id,
                            name: req.body.name,
                            uid: req.body.id,
                            email: req.body.email,
                        }
                        jsonwt.sign(
                            data,
                            mySecretkey,
                            {expiresIn:86400},
                            (error, token)=>{
                                res.cookie('token', token)
                                res.send({success: true})
                            }
                        )
                    })
                })
            })
            
        }else{
            res.send({email: "exist"})
        }
    })
})

//post route
//this is for login
router.post('/login',(req, res)=>{
   if(req.body.email === "admin@gmail.com"){
       if(req.body.password === "admin"){
                
        res.send({success: true, admin:"admin"})
        
       }else{
        res.send({password: "notcorrect"})
       }
   }else{
    Profile.findOne({email: req.body.email})
    .then((profile)=>{
        if(! profile){
            res.send({email: "notexist"})
        }else{
            bcryptjs.compare(req.body.password, profile.password)
            .then((authuser)=>{
                if(authuser){
                    const data = {
                        id: profile._id,
                        name: req.body.name,
                        uid: req.body.id,
                        email: req.body.email,
                    }
                    jsonwt.sign(
                        data,
                        mySecretkey,
                        {expiresIn: 86400},
                        (error, token)=>{
                            res.cookie('token', token)
                            res.send({success: true})
                        }
                    )
                }else{
                    res.send({password: "notcorrect"})
                }
            }).catch((error)=>{
                console.log(error)
            })
            
        }
    })
   }
})


module.exports = router