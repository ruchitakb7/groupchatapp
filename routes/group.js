const express= require('express')
const router= express.Router()
const auth= require('../middleware/auth')

const group= require('../controllers/groups')
//const { route } = require('./login')


router.post('/creategrp',auth.authenticate,group.creategrp)

router.get('/getallgroup/:id',group.getallgrp)

router.post('/addmember',group.addMember)

module.exports=router