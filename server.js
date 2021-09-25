const express = require('express');
const app = express();
const server = app.listen(3000, () => {
    console.log("Listening on port: " + 3000);
});
const io = require('socket.io')(server);

const {v4:uuidv4} = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res)=>{
    res.redirect(`/${uuidv4()}`)
})

app.get('/:room', (req,res)=>{
    res.render('room', {roomId: req.params.room})
})

io.on('connection', socket =>{
    socket.on('join-room', (roomId, userId)=>{
        socket.join(roomId)
        socket.broadcast.to(roomId).emit('user-connected', userId)

        socket.on('disconnect', ()=>{
            socket.broadcast.to(roomId).emit('user-disconnected', userId)
        })
    })
})