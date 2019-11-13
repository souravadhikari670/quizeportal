const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const passport = require('passport')
var app = express()
//server configuration
const port = process.env.PORT || 80
app.listen(port, ()=>{
    console.log('server is running at port '+ port)
})
//configuration of all middleware
app.set(express.static('./routes/public'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.use(logger('dev'))
app.use(cookieParser())

//initialize strategies
app.use(passport.initialize())
require('./strategies/jsonJWTstrategy')(passport)

//configure database
const db = require('./key/database').mongoURL
mongoose.connect(db, { useUnifiedTopology: true , useNewUrlParser: true })
.then(()=>{
    console.log("Database is connected")
})
.catch((error)=>{
    console.log(error)
})

//bring all the routes
const Home = require('./routes/api/home')
const Auth = require('./routes/api/auth')
const Question = require('./routes/api/question')
const Quize = require('./routes/api/quize')

//configure routes
app.use('/',Home)
app.use('/api/auth',Auth)
app.use('/api/admin',Question)
app.use('/api/quize/',Quize)