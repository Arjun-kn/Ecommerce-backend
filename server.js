const express = require('express');
var cors = require('cors')
const dotenv = require('dotenv')
const morgan = require('morgan');
let mongoose = require('mongoose')
let mongoData = require('./models/userModels')
let authRoute = require('./routes/authRoute.js')
let categoryRoute = require('./routes/categoryRoute.js')
let productRoute = require('./routes/productRoute.js')
dotenv.config();


mongoose.connect(process.env.MONGO_URL,{ useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log("DB connection successfull")
}).catch(err=>{
    console.log(err)
    
})



const app = express()
app.use(cors())


// middleware
app.use(express.json())
app.use(morgan('dev'))

app.use('/api/v1/auth',authRoute)
app.use('/api/v1/category',categoryRoute)
app.use('/api/v1/product',productRoute)

// app.get('/',(req,res)=>{
// res.status(200).json({
//     Message:"Welcome to ecommerce app"
// })



const port = process.env.PORT || 8080 

app.listen(port , ()=>{
    console.log(`Server running on ${port}`)
})