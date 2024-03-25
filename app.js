const express = require('express')
const app = express();
const dotenv= require('dotenv')
dotenv.config()
const port= process.env.port


app.listen(port);