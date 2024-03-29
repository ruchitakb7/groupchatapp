const User= require('../models/signup')
const Message= require('../models/message')
const Group=require('../models/groups')
const Usergrp=require('../models/usergrp')


exports.creategrp=async(req,res,next)=>{
    const grpname= req.body.grpname
    try{
        const group= await Group.create({grpname:grpname,createdby:req.user.id})
        await Usergrp.create({userId:req.user.id,groupId:group.id,grpname:grpname})
        res.status(200).json({group})
    }
    catch(e)
    {
        console.log(e)
        res.json({e})
    }
}

exports.getallgrp=async(req,res,next) =>{
    const userid= req.params.id
    try{
        const group = await Usergrp.findAll({where:{userId:userid}})
        res.json({group})
    }
    catch(e)
    {
        console.log(e)
        res.json({e})
    }
}


exports.addMember=async(req,res,next)=>{
    const {email,grpname,grpid}=req.body
    try{
        const user= await User.findOne({where:{email:email}})
        console.log(user)
        if(user!=null)
        {
            const response= await Usergrp.create({grpname:grpname,groupId:grpid,userId:user.id})
            console.log(response)
           return res.json({response})
        }
        else{
            throw new Error('user not exist')
        }
      

    }catch(e)
    {
        console.log(e)
       return res.status(404).json({e})
    }
}