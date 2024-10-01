const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/database')
const cookieParser = require('cookie-parser')
const userRoute = require('./routes/userRoute.js')
const postRoute = require('./routes/postRoute.js')
const nodemailer = require('nodemailer')
const cors = require('cors')

//config
dotenv.config({path:'config/.env'})

//connecting database
connectDB()

const app = express()
const options = {
    origin:"http://localhost:5173",
    credentials:true,
    allowedHeaders: ['Content-Type', 'Authorization']
}

//middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors(options))
app.use('/uploads', express.static('uploads'));

exports.transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth:{
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})


//routes
app.use('/api',userRoute)
app.use('/api',postRoute)

app.listen(process.env.PORT,()=>{
    console.log(`server is running on PORT:${process.env.PORT}`)
})