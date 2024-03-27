const jwt=require('jsonwebtoken')


const User=require('../models/signup');

exports.authenticate=async(req,res,next)=>{
    const token=req.header('Authorization')
    try {
        const user=jwt.verify(token,'secretKey');
        console.log('userId',user.userId);
        const dataUser=await User.findByPk(user.userId);
        console.log(dataUser);
        req.user=dataUser;
        next();

        
    } catch (error) {
        console.log(error);
        return res.status(401).json({success:false});
    }
}

