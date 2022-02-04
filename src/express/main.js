const io = require('socket.io')(8454);
const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, "..", "game")));

app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, "..", "game", "index.html"))
})

app.listen(8453);

var users = {}
var points = [];

io.on('connection', socket => {
    socket.on("defaults", (d)=>{
        if(points.length <= 0){
            points = d;
        }
    })
    socket.emit("loadMap", points)

    socket.on("join", (d)=>{
        users[socket.id] = {
            nick: d.nick,
            x: 0,
            y: 0,
            c: d.color
        }
        io.emit("userJoin", users)
        socket.emit("userConnected", socket.id)
    })

    socket.on("updateCursor", (c)=>{
        if(users[c.id]){
            users[c.id].x = c.x;
            users[c.id].y = c.y;

            io.emit("updateCursor", {
                id: c.id,
                u: users[c.id]
            })
        }
    })

    socket.on("disconnect", ()=>{
        delete users[socket.id];
    })

    socket.on('updateMap', (res) => {
        var data = JSON.parse(res);

        points[data.id] = data.block;
        io.emit('updateMap', res)
    })
})