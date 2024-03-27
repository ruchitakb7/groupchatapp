const express = require('express')
const router= express.Router()

const messagecontroller= require('../controllers/message')

const auth= require('../middleware/auth')

router.post('/addmessage',auth.authenticate,messagecontroller.addMessage)

module.exports=router