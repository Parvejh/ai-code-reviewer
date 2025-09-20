const express = require('express');
const aiRoutes = require('./routes/ai.routes')
const cors = require('cors');

const app = express();
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;


app.use(cors({
    origin:FRONTEND_ORIGIN,
    methods:['GET','POST']
}))

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Hello World")
})

app.use('/ai',aiRoutes);

module.exports = app;