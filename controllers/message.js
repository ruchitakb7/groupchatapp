const User= require('../models/signup')
const Message= require('../models/message')
const Group=require('../models/groups')
const Usergrp=require('../models/usergrp')

const jwt = require('jsonwebtoken')



exports.addMessage= async(req,res,next)=>{

    const mess= req.body.msg;
    const groupId=req.body.groupId
    console.log(groupId)

    try{
      const message=  await Message.create({
            msg:mess,
            name:req.user.name,
            userId:req.user.id,
            groupId:groupId,
            type:'text'
    
        })
        console.log(message)
        res.json({success:true,msg:text})

    }
    catch(e)
    {
        res.json(e)
    }
}

exports.getmessage= async(req,res,next)=>{
    const groupId= req.params.id
    try{
        const message= await Message.findAll({where:{groupId:groupId}})
       
        res.json({msg:message})

    }
    catch(e)
    {
        res.json(e)
    }

}




