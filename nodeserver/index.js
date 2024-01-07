// node server which will handle socket io connections

// const io = require('socket.io')(8000) // runing socket.io server that attaches itself to http instance

const http = require('http');
const httpServer = http.createServer();
const io = require('socket.io')(httpServer,{
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

const users = {};


//io.on is a socket.io instance meaning it will handles all connection
io.on('connection',socket =>{
    socket.on('new-user-joined', name =>{
        //socket.on handles a particular connection
        users[socket.id]= name;
        socket.broadcast.emit('user-joined',name) // tells all the other user about the joined user except himself
    });
    // here "send", "new-user-joined" are some custom event names
    socket.on("send",message =>{
        socket.broadcast.emit('receive',{message:message,name:users[socket.id]})
    });

     // If someone leaves the chat, let others know 
     socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});

httpServer.listen(8000, () => {
    console.log('Server is running on port 8000');
  });