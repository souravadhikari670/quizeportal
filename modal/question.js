const mongoose = require('mongoose')
const Schema = mongoose.Schema

const newSchema = new Schema({
    title: {
        type: String
    },
    des: {
        type: String
    },
    option:[{
        title:{
            type: String
        }
    }],
    answer:{
        type: Number
    },
    code:{
        type: String
    }
})

const ProductSchema = mongoose.model('question',newSchema)
module.exports = ProductSchema
