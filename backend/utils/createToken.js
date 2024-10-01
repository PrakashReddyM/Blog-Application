const jwt = require('jsonwebtoken')

const createToken = async(user,statusCode,res)=>{
    try {
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'3d'})
        const options = {
            httpOnly:true,
            secure:true,
            maxAge: 3*24*60*60*1000
        }

        res.status(statusCode).cookie('token',token,options).json({
            success:true,
            user,
            token
        })

    } catch (error) {
        console.log(error)
    }
}

module.exports = createToken;