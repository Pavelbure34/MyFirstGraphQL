import uuidv4 from 'uuid/v4';              //module for random id generation

const Mutation = {//this allows changing making new data into your db.
    createPlayer(parent,{data},{db},info){
        const {players} = db;
        const {name, email} = data;
        //if emails are already being used, throw an error to the client.
        if (players.some((player)=>player.email === email))
            throw new Error('Emails are already being used.');
        const id = uuidv4(); //generating random ID for a new player
        /*  Using spread-rest operation, these can be directly copied into.
            const args = {       
                email:email,
                name:name,
                occupation:occupation
            };
        */
        const new_player = { //new player created.
            id:id,
            ...data,         //copying properties from copy
            level:1,
            Logs:id,
            friendReqSent:name,
            friendReqReceive:name
        };
        players.push(new_player);//adding new user to the player array.
        return new_player;       //returning the player we just created
    },
    sendRequest(parent,{data},{db},info){
        const {players, friendRequests, reqMessages} = db;
        const {sender, receiver, message} = data;
        if (players.some((player)=>player.name.toLowerCase()===sender.toLowerCase()) === false)
            throw new Error("sender not in the player database");
        else if (players.some((player)=>player.name.toLowerCase()===receiver.toLowerCase()) === false)
            throw new Error("receiver not in the player database");
        /*using transform-object-rest-spread
              const copy = {             
                sender:sender,
                receiver:receiver
            };
        */
       const messageID = uuidv4();
       const newMessage = {
            id:messageID,
            text:message
       };
        const new_request = {
            id:uuidv4(),
            sender:sender,
            receiver:receiver,
            message:messageID
        };
        friendRequests.push(new_request);
        reqMessages.push(newMessage);
        return new_request;
    },
    deletePlayer(parent, args, {db}, info){//deletion Operation
        const {players, Logs, friendRequests} = db;
        const playerIndex = players.findIndex((player) => player.id === args.id); 
        if (playerIndex === -1)//1. check if the matching user exists
            throw new Error("Player not found.");
        /*
            when a matching player exists,
                1. delete a player from player database set
                2. delete other data in other database sets which a deleted player is related  
                3. return the deleted user data.
         */
        const deletedPlayer = players.splice(playerIndex, 1);                   //splice method returns returns the array of deleted items by default
        //players = players.filter((player)=>player.id !== deletedPlayer[0].id); equivalent to this but without returning deleted data.
        const {name,id} = deletedPlayer[0];
        Logs = Logs.filter((log)=> log.player !== id);          //deleting related data
        friendRequests = friendRequests.filter((request)=>
            request.sender !== name || request.receiver !== name); 
        return deletedPlayer[0];
    },
    deleteLog(parent, {id}, {db}, info){
        const {Logs} = db;
        const logIndex = Logs.findIndex((log)=>log.id === id); 
        if (logIndex === -1) //does the log I try to delete exists?
            throw new Error("Log not found");
        const deletedLog = Logs[logIndex];
        Logs = Logs.filter((log)=>log.id !== id);
        return deletedLog;
    },
    deleteRequest(parent, {id}, {db}, info){
        const {friendRequests, reqMessages} = db;
        const requestIndex = friendRequests.findIndex((request)=>request.id === id);
        if (requestIndex === -1) //does the request I try to delete exists?
            throw new Error("friendRequest not found");
        const deletedReq = friendRequests[requestIndex];
        friendRequests = friendRequests.filter((request)=>request.id !== id);
        reqMessages = reqMessages.filter((message)=>message.id !== deletedReq.message);
        return deletedReq;
    }
};

export default Mutation;