const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProfileSchema = new Schema({
    
    uid:{
        type: String
    },
    name:{
        type:String
    },
    email:{
        type: String
    },
    password:{
        type: String
    },
    result: [{
        code:{
            type: String
        },
        score:{
            type: String
        }
    }]
})

const thisSchema = mongoose.model('Profile',ProfileSchema)
module.exports = thisSchema