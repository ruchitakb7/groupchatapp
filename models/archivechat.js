const Sequelize = require('sequelize');

const sequelize=require('../util/database');

const Archive= sequelize.define('archivechat',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    username:
    {
        type:Sequelize.STRING,
        allowNull:false
    },
    grpname:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports=Archive