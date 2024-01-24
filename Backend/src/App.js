const express = require('express')
const app = express();

let port = 5000
app.get('/',(req,res)=>{
    res.send("Rishabh Singh")
})
app.listen(port,()=>{
    console.log(`listing to the port ${port}`);
})
