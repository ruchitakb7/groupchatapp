const express= require('express');
const app= express();

const path=require('path');
const dotenv = require('dotenv');
dotenv.config()



const seq = require('./util/database.js');
const User= require('./models/signup.js');


app.use(express.json());
app.use(express.static('public')) 
app.use(express.static(path.join(__dirname, "views"))) 


const signuprouterFile= require('./routes/signup.js');   
app.use(signuprouterFile);




seq.sync()
.then(res=>
   { 
    app.listen(process.env.port);  
})                               
.catch((e)=>{
   console.log(e)

})
