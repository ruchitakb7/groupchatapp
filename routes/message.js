const express = require('express')
const router= express.Router()

const messagecontroller= require('../controllers/message')

const auth= require('../middleware/auth')

router.post('/addmessage',auth.authenticate,messagecontroller.addMessage)

router.get('/allmessage',messagecontroller.getmessage)

module.exports=router