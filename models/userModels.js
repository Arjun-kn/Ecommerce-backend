let mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
name:{
    type:String,
    required:true,
    trim:true
},
email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true
},

phone:{
type:String,
required:true
},
address:{
    type:String,
    required:true
},

answer: {
type: {},
required: true,
},
role:{
    type:Number,
    default:0
}
},{timestamps:true})

let usermodel = mongoose.model('users',userSchema)
module.exports = usermodel;