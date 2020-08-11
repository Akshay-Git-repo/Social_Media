class ChatEngine{

    constructor (chatBoxID,userEmail,userName)
    {

        this.chatBox=$(`#${chatBoxID}`);
        this.userEmail=userEmail;
        this.userName=userName;
        //io came from socket io cdn which is present in home.ejs
        this.socket=io.connect('http://localhost:5000');


        if(this.userEmail)
        {
            this.connectionHandler();
        }

    }


    connectionHandler()
    {

        let self=this;

        //first it will do the connect from subscriber end(user who is on browser) and then it will trigger connection on observer end here it is chat_sockets.js   
        this.socket.on("connect",function()
        {
           
            console.log("Connection established successfully using socket");

            self.socket.emit("join_room",
            {
                user_name:self.userName,
                user_email:self.userEmail,
                chatroom:'Codeial',
            });

            self.socket.on("user_joined",function(data)
            {
                console.log("user joined",data);
            });

            $('#send-message').click(function(){
                let msg=$("#chat-message-input").val();
                if(msg!="")
                {
                    self.socket.emit('send_message',
                    {
                        message:msg,
                        name:self.userName,
                        user_email:self.userEmail,
                        chatroom:'Codeial'
                    });
                };
            });

            self.socket.on("receive_message",function(data)
            {
                console.log("message received",data.message);
                console.log(data.user_email);
                console.log(self.userEmail);

                let newMessage=$("<li>");

                let messageType='other-message';

                if(data.user_email==self.userEmail)
                {
                    messageType='self-message'; 
                };

                newMessage.append(`<span>${data.message}</span>`);
                newMessage.append(`<br><sub style="font-size:10px">${data.name}</sub>`);
                newMessage.addClass(messageType);

                $('#chat-messages-list').append(newMessage);

            })
        })
    }

}