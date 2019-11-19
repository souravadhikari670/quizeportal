const express = require('express')
const router = express.Router()
const passport = require('passport')
const multer = require('multer')
const randomstring = require('randomstring')

var Profile = require('../../modal/profile')
var Admin = require('../../modal/admin')
var Question = require('../../modal/question')
var Answer = require('../../modal/answer')

router.post('/takequize',
 passport.authenticate('jwt',{session: false,failureRedirect:'/api/auth/login'}),(req, res)=>{

    if( req.user.uid == req.body.id ){

      Question.find()
      .then((ques)=>{

        for( i=0;i<ques.length;i++){
            if( ques[i].code == req.body.code ){
                res.send({success:true, code: ques[i].code})
                break
            }
        }
      })
      .catch((error)=>{
          console.log(error)
      })

    }else{
        res.send({id:'error'})
    }

 })

 router.get('/takequize/53132198sroigdnDklfdFRID/:code/65321321645earfasdaasdcr55',
 passport.authenticate('jwt',{session:false,failureRedirect:'/api/auth/login'}),(req, res)=>{

    var quizeQues = []
    Admin.findOne({email:'admin@gmail.com'})
    .then((admin)=>{

        if(!admin){
            const newAnswer = new Admin({
                code: req.params.code,
                uid: req.user.id,
            })
          newAnswer.save()
          .then(()=>{
                Question.find()
                .then((q)=>{
                for(i=0;i<q.length;i++){
        
                    if( q[i].code == req.params.code ){
                    
                        quizeQues.push(q[i])
                    }
                }
                res.render('home',{quizeQues, auth:true})
            })
            .catch((error)=>{
                console.log(error)
                })
          })
          .catch((error)=>{
              console.log(error)
          })
        }
        else if(!admin.result.map(item => item.uid).indexOf(req.user.id))
        {
            if(!admin.result.map(item => item.code).indexOf(req.params.code)){
                res.json('Your answers are already submitted')
            }else{
                Question.find()
                .then((q)=>{
                for(i=0;i<q.length;i++){
        
                    if( q[i].code == req.params.code ){
                     
                        quizeQues.push(q[i])
                    }
                }
                res.render('home',{quizeQues, auth:true})
            })
            .catch((error)=>{
                console.log(error)
            })
        }
    }else{
        Question.find()
        .then((q)=>{
        for(i=0;i<q.length;i++){

            if( q[i].code == req.params.code ){
             
                quizeQues.push(q[i])
            }
        }
        res.render('home',{quizeQues, auth:true})
    })
    .catch((error)=>{
        console.log(error)
    })
    }
    })
    .catch((error)=>{
        console.log(error)
    })
 })


 router.post('/save/:id',passport.authenticate('jwt',{session:false,failureRedirect:'/api/auth/login'}),(req, res)=>{

    Answer.findOne({qid:req.params.id})
    .then((ans)=>{
        if(ans){
            if( ans.code === req.body.code ){
                console.log('abc')
                Answer.findOneAndUpdate({qid:req.params.id},{$set:{answer:Number(req.body.answer)}},{new:true})
                .then(()=>{
                    res.send({success:true})
                })
                .catch((error)=>{
                    console.log(error)
                })
            }else{
            const newAnswer = new Answer({
                qid: req.params.id,
                uid: req.user.id,
                correct: Number(req.body.correct),
                answer: Number(req.body.answer),
                code:req.body.code
            })
            newAnswer.save()
            .then(()=>{
                res.send({success:true})
            })
            .catch((error)=>{
                console.log(error)
            })
        }

        }else{

            const newAnswer = new Answer({
                qid: req.params.id,
                uid: req.user.id,
                correct: Number(req.body.correct),
                answer: Number(req.body.answer),
                code:req.body.code
            })
            newAnswer.save()
            .then(()=>{
                res.send({success:true})
            })
            .catch((error)=>{
                console.log(error)
            })
        }

    })
    .catch((error)=>{
        console.log(error)
    })

 })

 router.get('/result/53132198sroigdnDklfdFRID/:code/65321321645earfasdaasdcr55',
 passport.authenticate('jwt',{session:false, failureRedirect:'/api/auth/login'}),(req, res)=>{

    Answer.find()
    .then((ans)=>{

        var array = []

        for( i=0;i<ans.length;i++ ){
            if( ans[i].code == req.params.code ){
                if( ans[i].correct == ans[i].answer ){

                    array.push(ans[i])
                }
            }
        }

        Admin.findOne({email:'admin@gmail.com'})
        .then((admin)=>{
            if(!admin){
                const newAnswer = new Admin({
                    code: req.params.code,
                    uid: req.user.id,
                    score: array.length
                })
        
              newAnswer.save()
            }else if(admin){
                if(admin.result.map(item => item.code).indexOf(req.params.code)){
                const newAnswer = {
                    code: req.params.code,
                    uid: req.user.id,
                    score: array.length
                }
                admin.result.push(newAnswer)
                admin.save()
                .then(()=>{
                    res.render('result',{array})
                })
                .catch((error)=>{
                    console.log(error)
                })
            }else{
                res.render('result',{array})
            }
            }
        })
        .catch((error)=>{
            console.log(error)
        })
    })
    .catch((error)=>{
        console.log(error)
    })

 })

 module.exports = router