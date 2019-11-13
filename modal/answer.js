const mongoose = require('mongoose')
const Schema = mongoose.Schema

const newSchema = new Schema({
    qid: {
        type: Schema.Types.ObjectId,
        ref:'Question'
    },
    uid: {
        type: Schema.Types.ObjectId,
        ref:'Profile'
    },
    answer:{
        type: Number
    },
    correct:{
        type: Number
    },
    code:{
        type: String
    }
})

const ProductSchema = mongoose.model('answer',newSchema)
module.exports = ProductSchema
