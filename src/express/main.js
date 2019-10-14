const io = require('socket.io')(8454);
const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, "..", "game")));

app.get("/", (req, res)=>{    
    res.sendFile(path.join(__dirname, "..", "game", "index.html"))
})

app.listen(8453);

var points = [];

io.on('connection', socket => {
    socket.on("defaults", (d)=>{
        if(points.length <= 0){
            points = d;
        }
    })
    socket.emit("loadMap", points)

    socket.on('updateMap', (res) => {        
        var data = JSON.parse(res);
        console.log(res);        
        
        points[data.id] = data.block;
        io.emit('updateMap', res)
    })
})