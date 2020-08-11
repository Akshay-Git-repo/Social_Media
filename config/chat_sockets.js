module.exports.chatSockets=function(socketServer)
{
   
    let io=require("socket.io")(socketServer);

    io.sockets.on("connection",function(socket)
    {
        console.log("new connection received",socket.id);

        socket.on("disconnect",function()
    {
        console.log("Connection Disconnected",socket.id);

      
       
    
            
    
    });


    //this will execute when emit from chat engine comes here flow of process is emit(emit from chat_engine)--->on(on from chat_sockets) 

    
    socket.on("join_room",function(data)
    {
        console.log("joining request rec",data);

        //join the chatroom
        socket.join(data.chatroom);

        //now inform whole user who are in chatroom that i joined the chatroom including self also

        io.in(data.chatroom).emit('user_joined',data);
    });

    socket.on("send_message",function(data)
    {
        
        io.in(data.chatroom).emit('receive_message',data);
        
    });


    });

    

}