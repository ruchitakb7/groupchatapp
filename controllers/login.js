const User= require('../models/signup')



exports.loginpage=async(req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','views','login.html'))
}