const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const { MailtrapClient } = require("mailtrap");
const createToken = require('../utils/createToken')
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");

//register
exports.register = async (req, res, next) => {
    const { username, email, password } = req.body;
    console.log(username,email,password)
    try {
        if (!username || !email || !password) {
           return  res.status(400).json({ success: false, message: "Please Enter All Details" })
        }
        
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({ username, email, password: hashedPassword })

        await user.save()
        createToken(user, 201, res)
    } catch (error) {
        res.status(500).json({ success: 'error', message: error })
    }
}

//login
exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
           return  res.status(400).json({ success: false, message: "Please Enter All Details" })
        }

        const user = await User.findOne({ email })
        if (!user) {
           return res.status(400).json({ success: false, message: 'user Doesn`t Exists' })
        }

        const comparePass = await bcrypt.compare(password, user.password)
        if (!comparePass) {
            return res.status(400).json({ success: false, message: 'Incorrect Email or Password' })
        }

        await user.save()
        createToken(user, 200, res)
    } catch (error) {
        res.status(500).json({ success: 'error', message: error })
    }
}

//logout
exports.logout = async (req, res, next) => {
    try {
        res.status(200).cookie('token', '', { maxAge: 0 }).json({
            success: true,
            message: 'Loggod Out successfully'
        })
    } catch (error) {
        res.status(500).json({ success: 'error', message: error })
    }
}

//send-email
// send-email
exports.sendMail = async (req, res, next) => {
    try {
        const {subject} = req.body;
        const TOKEN = process.env.MAILTRAP_TOKEN; 

        const client = new MailtrapClient({
            token: TOKEN,
        });

        
        const sender = {
            email: "hello@demomailtrap.com",
            name: "Mailtrap Test",
        };
        
        const recipients = [
            {
                email: "prakashreddym2002@gmail.com", 
            }
        ];
        const templatePath = path.join(__dirname,"..", "templates", "welcome.ejs");
        const template = fs.readFileSync(templatePath, "utf-8");
        const emailHtml = ejs.render(template, { name:sender.name, email:recipients.email });
        
        const emailData = {
            from: sender,
            to: recipients,
            subject,
            html:emailHtml,
            category: "Integration Test",
        };

        const response = await client.send(emailData);

        return res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};



//getAllUsers
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find()
        res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        res.status(500).json({ success: 'error', message: error })
    }
}

//getUser By Id
exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ success: false, message: 'User Not Found' })
        }
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(500).json({ success: 'error', message: error })
    }
}

//editProfile
exports.editProfile = async(req,res,next)=>{
    try {
        const user = await User.findById(req.user._id);
        if(!req.file){
            return res.status(404).json({})
        }
    } catch (error) {
        res.status(500).json({success:'error', message: error})
    }
}