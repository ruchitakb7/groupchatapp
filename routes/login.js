const express= require('express');
const router= express.Router()

const logincontroller= require('../controllers/login')

router.get('/login',logincontroller.loginpage)

module.exports=router;