const express = require('express')
const cors = require('cors');
const port = 3600

const app = express();

app.use(cors());


app.get('/appmount', (req,res) => {
    res.send({
        welcome: "hello world"
    })
})

app.listen(port, () =>{
    console.log(`server listening on ${port}`)
})