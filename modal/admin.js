const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProfileSchema = new Schema({
    
    name:{
        type:String,
        default: 'admin'
    },
    email:{
        type: String,
        default:'admin@gmail.com'
    },
    password:{
        type: String,
        default:'admin'
    },
    result: [{
        code:{
            type: String
        },
        uid:{
            type: Schema.Types.ObjectId,
            ref:'Profile'
        },
        score:{
            type: String
        }
    }]
})

const thisSchema = mongoose.model('admin',ProfileSchema)
module.exports = thisSchema