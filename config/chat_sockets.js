var users=[];
module.exports.chatSockets=function(socketServer)
{
    let io=require("socket.io")(socketServer);
    io.sockets.on("connection",function(socket)
    {
      //  console.log("new connection received",socket.id);

    socket.on("disconnect",function()
    {
       // console.log("Connection Disconnected",socket.id);
        for(let i=0; i < users.length; i++){
                    
            if(users[i].userSocketId === socket.id){
                users.splice(i,1); 
                
                 //$(classtoberemoved).removeClass("dot");
            }
        }
     

       
    });
    
    //this will execute when emit from chat engine comes here flow of process is emit(emit from chat_engine)--->on(on from chat_sockets) 

    
    socket.on("join_room",function(data)
    {


        for(let i=0; i < users.length; i++){
                    
            if(users[i].id === data.user_email){
                users.splice(i,1); 
            }
        }
        
        users.push({
            id:data.user_email,
            userSocketId:data.socketId,
        });
     //   console.log(users);
       // console.log("joining request rec",data);

        //join the chatroom
        socket.join(data.chatroom);
        data.user=users;
        io.in(data.chatroom).emit('user_joined',data);    
      
    
        //now inform whole user who are in chatroom that i joined the chatroom including self also

        
    });

    socket.on("send_message",function(data)
    {
        if(data.toUser){
        for(let i=0; i < users.length; i++){
            if(users[i].id === data.toUser){

        io.to(users[i].userSocketId).emit('receive_message',data);

        
        io.to(socket.id).emit('receive_message',data);
            }
            
        }
    }
    else{
        io.in(data.chatroom).emit('receive_message',data);

    }
        
    });


    });

    

}