const express= require('express');
const app= express();

const path=require('path');
const cors= require('cors')
const dotenv = require('dotenv');
dotenv.config()



const seq = require('./util/database.js');
const User= require('./models/signup.js');
const Message=require('./models/message.js');


app.use(cors({
    origin:"*",
}))
app.use(express.json());
app.use(express.static('public')) 
app.use(express.static(path.join(__dirname, "views"))) 


const signuprouterFile= require('./routes/signup.js');   
app.use(signuprouterFile);
const loginrouterFile= require('./routes/login.js')
app.use(loginrouterFile)
const messageRouterfile=require('./routes/message.js')
app.use(messageRouterfile)


User.hasMany(Message)
Message.belongsTo(User)

seq.sync()
.then(res=>
   { 
    app.listen(process.env.port);  
})                               
.catch((e)=>{
   console.log(e)

})
