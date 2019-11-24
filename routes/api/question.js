const express = require('express')
const router = express.Router()
const passport = require('passport')
const multer = require('multer')
const randomstring = require('randomstring')
// // configuration multer
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './routes/public/product')
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + file.originalname)
//     }
//   })
   
//   var upload = multer({ storage: storage })

//schema
const Question = require('../../modal/question')
const Profile = require('../../modal/profile')
const Admin = require('../../modal/admin')

//add product panel
router.get('/addquestion',passport.authenticate('jwt',{session:false, failureRedirect:'/sessionexpire'}),(req,res)=>{
    res.render('addquestion',{auth:true})
})

router.post('/addquestion',passport.authenticate('jwt',{session:false, failureRedirect:'/sessionexpire'}),(req, res)=>{

    const newQuestion = new Question({
        title:req.body.title,
        des: req.body.des,
        answer: req.body.answer,
    })
    newQuestion.save()
    .then((product)=>{

        const option1 = {}
        option1.title = req.body.first
        const option2 = {}
        option2.title = req.body.second
        const option3 = {}
        option3.title = req.body.third
        const option4 = {}
        option4.title = req.body.fourth

        product.option.push(option1)
        product.option.push(option2)
        product.option.push(option3)
        product.option.push(option4)
        product.save()
        .then(()=>{
            res.send({success:true})
        })
        .catch((error)=>{
            console.log(error)
        })
    })
    .catch((error)=>{
        console.log(error)
    })
    
})

router.get('/viewquestion',passport.authenticate('jwt',{session:false, failureRedirect:'/sessionexpire'}),(req, res)=>{

    Question.find()
    .then((question)=>{

        res.render('question',{question})
    })
    .catch((error)=>{
        console.log(error)
    })

})

router.post('/deletequestion/:pid',passport.authenticate('jwt',{session:false, failureRedirect:'/sessionexpire'}),(req, res)=>{

    Question.findByIdAndRemove(req.params.pid)
    .then((ques)=>{
        res.send({success: true})
    })
    .catch((error)=>{
        console.log(error)
    })
})

//create quizee
router.post('/createquize',passport.authenticate('jwt',{session:false, failureRedirect:'/sessionexpire'}), (req, res)=>{

    var questionArray = req.body.questionArray
    const rand = randomstring.generate(8)
    const quizeCode = rand
    for( i=0;i<questionArray.length;i++ ){

        Question.findByIdAndUpdate(questionArray[i],{$set:{code:rand}},{new:true})
        .then((ques)=>{
    
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    res.send({code: quizeCode})
})

router.get('/viewsubmission',passport.authenticate('jwt',{session:false, failureRedirect:'/sessionexpire'}), (req,res)=>{
    Admin.findOne({email:"admin@gmail.com"})
    .then((admin)=>{
        if( admin ){
            const result = admin.result
            
            res.render('submission',{result})

        }else{
            res.json("no submission yet")
        }
    })
    .catch((error)=>{
        console.log(error)
    })
})

module.exports = router