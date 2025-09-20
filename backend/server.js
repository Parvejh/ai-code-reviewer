require('dotenv').config();
const app = require('./src/app.js');
const PORT = process.env.PORT || 8000;

app.listen(PORT,()=>{
    console.log("Server is running at http://localhost:",PORT);
})