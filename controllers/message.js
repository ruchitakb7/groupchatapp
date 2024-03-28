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

exports.getmessage= async(req,res,next)=>{
    try{
        const message= await Message.findAll({
            attributes: ['name','msg','userId']
        })
       
        res.json({msg:message})

    }
    catch(e)
    {
        res.json(e)
    }

}


