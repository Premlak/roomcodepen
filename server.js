const express = require('express');
const app = express();
const http = require('http');
const {Server} = require('socket.io');
const ACTIONs = require('./src/Actions');
const path = require('path');
const server = http.Server(app);
const io = new Server(server);
app.use(express.static('build'));
app.use((req, res, nxt)=>{
res.sendFile(path.join(__dirname,'build','index.html'))
})
const userSocketMap = {};
function getAllConnectedClients(roomId){
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=>{
        return {
            socketId,
            userName: userSocketMap[socketId]
        };
    });
}
io.on('connection',(socket)=>{
    console.log('socket connected',socket.id);
    socket.on(ACTIONs.JOIN,({roomId,userName})=>{
        userSocketMap[socket.id] = userName;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        clients.forEach(({socketId})=>{
            io.to(socketId).emit(ACTIONs.JOINED,{
                clients,
                userName,
                socketId: socket.id,
            })
        })
    });
    socket.on(ACTIONs.HTML_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONs.HTML_CHANGE, { code });
    });
    socket.on(ACTIONs.HTML_SYNC,({roomId,code})=>{
        io.to(roomId).emit(ACTIONs.HTML_CHANGE,{code})
    });
    socket.on(ACTIONs.CSS_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONs.CSS_CHANGE, { code });
    });
    socket.on(ACTIONs.CSS_SYNC,({roomId,code})=>{
        io.to(roomId).emit(ACTIONs.CSS_CHANGE,{code})
    });
    socket.on(ACTIONs.JAVASCRIPT_CHANHE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONs.JAVASCRIPT_CHANHE, { code });
    });
    socket.on(ACTIONs.JAVASCRIPT_SYNC,({roomId,code})=>{
        io.to(roomId).emit(ACTIONs.JAVASCRIPT_CHANHE,{code})
    });
    socket.on('disconnecting',()=>{
        const rooms = [...socket.rooms];
        rooms.forEach((roomId)=>{
            socket.in(roomId).emit(ACTIONs.DISCONNECTED,{
                socketId: socket.id,
                userName: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    })
})
const PORT = process.env.PORT || 3001;
server.listen(PORT,()=>{console.log(`Port started on ${PORT}`)});

