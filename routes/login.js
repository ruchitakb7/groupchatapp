const express= require('express');
const router= express.Router()

const logincontroller= require('../controllers/login')

router.get('/login',logincontroller.loginform)

router.post('/userloginCheck',logincontroller.checkuser)

module.exports=router;