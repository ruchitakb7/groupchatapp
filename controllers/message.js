const User= require('../models/signup')
const Message= require('../models/message')

const jwt = require('jsonwebtoken')



exports.addMessage= async(req,res,next)=>{
    const text= req.body.msg;
    try{
        await Message.create({
            msg:text,
            name:req.user.name,
            userId:req.user.id
        })
        res.json({success:true,msg:text})

    }
    catch(e)
    {
        res.json(e)
    }
}


