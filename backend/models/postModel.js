const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    content:{
        type:String,
        // required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    image:{
        type:String,
        default:null
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    },
    comments:[{
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        text:{
            type:String,
            required:true
        },
        createdAt:{
            type:Date,
            default: Date.now
        }
    }],
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
},{timestamps:true})

module.exports = mongoose.model('Post',postSchema)