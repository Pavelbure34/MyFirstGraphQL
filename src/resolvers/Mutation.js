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
        let {players, Logs, friendRequests} = db; //let because of mutation operation
        const playerIndex = players.findIndex(player => player.id === args.id); 
        if (playerIndex === -1)//1. check if the matching user exists
            throw new Error("Player not found.");
        /*
            when a matching player exists,
                1. delete a player from player database set
                2. delete other data in other database sets which a deleted player is related  
                3. return the deleted user data.
         */
        const deletedPlayer = players.splice(playerIndex, 1);//splice method returns returns the array of deleted items by default
        //players = players.filter((player)=>player.id !== deletedPlayer[0].id); equivalent to this but without returning deleted data.
        const {name,id} = deletedPlayer[0];
        Logs = Logs.filter(log=> log.player !== id);          //deleting related data
        friendRequests = friendRequests.filter(request=>
            request.sender !== name || request.receiver !== name); 
        return deletedPlayer[0];
    },
    updatePlayer(parent, {id, data}, {db}, info){
        let {players} = db;                                                //use let for mutation operation.
        if (playerIndex === -1)                                            //if player does not exist, 
            throw new Error("Player not found");                           //throw an error
        if (!data)                                                         //no data is input,
            return players.find(player=>player.id === id);                 //just return the player
        const {newEmail, newOccupation, newLevel} = data;                  //data for updated information
        const playerIndex = players.findIndex(player => player.id === id); //index for player.
        if (newEmail !== null && typeof newEmail === 'string' && players.some(player=>player.email === newEmail))
            throw new Error("Email already taken");
        const {email, level, occupation} = players[playerIndex];
        players[playerIndex].email = (newEmail !== null)?newEmail:email;
        players[playerIndex].occupation = (newOccupation !== null)?newOccupation:occupation;
        players[playerIndex].level = (newLevel !== null)?newLevel:level; 
        return players[playerIndex];
    },
    deleteLog(parent, {id}, {db}, info){
        let  {Logs} = db; //let because of mutation operation
        const logIndex = Logs.findIndex(log => log.id === id); 
        if (logIndex === -1) //does the log I try to delete exists?
            throw new Error("Log not found");
        const deletedLog = Logs[logIndex];
        Logs = Logs.filter((log)=>log.id !== id);
        return deletedLog;
    },
    updateLog(parent, {id, data}, {db}, info){      //work on this.
        let {Logs, players} = db;
        const logIndex = Logs.findIndex(log => log.id === id);
        if (logIndex === -1)
            throw new Error("Log not found");
        if (!data)
            return Logs.find(log=>log.id === id);
        const {newAccess, newPlayer} = data;
        const {last_access, player} = Logs[logIndex];
        if (!players.find(player=>player.id === newPlayer))
            throw new Error('Player not found!');
        if (newAccess.length !== 4)
            throw new Error('Access has to be 4 long time string');
        Logs[logIndex].player = (newPlayer !== null)?newPlayer:player;
        Logs[logIndex].last_access = (newAccess !== null)?newAccess:last_access;
        return Logs[logIndex];
    },
    deleteRequest(parent, {id}, {db}, info){
        let {friendRequests, reqMessages} = db; //let because of mutation operation
        const requestIndex = friendRequests.findIndex(request => request.id === id);
        if (requestIndex === -1) //does the request I try to delete exists?
            throw new Error("friendRequest not found");
        const deletedReq = friendRequests[requestIndex];
        friendRequests = friendRequests.filter(request => request.id !== id);
        reqMessages = reqMessages.filter(message => message.id !== deletedReq.message);
        return deletedReq;
    },
    updateRequest(parent,{id,data},{db},info){
        let {friendRequests, players, reqMessages} = db;               //destructured databases.
        const reqIndex = friendRequests.findIndex(req=>req.id === id); //our target exist or not?
        if (reqIndex === -1)                                           //if not
            throw new Error('no Request found!');                      //throw an error
        if (!data)                                                     //if data is not given
            return friendRequests[reqIndex];                           //return the default values
        const {newSender, newReceiver, newMessage} = data;             //if exists
        if (!players.find(player=>player.name === newSender) ||
            !players.find(player=>player.name === newReceiver))        //does sender and receiver exists?
            throw new Error('receiving or sending Player not found!'); //if not, throw an error
        const {sender, receiver} = friendRequests[reqIndex];           //if so,
        friendRequests[reqIndex].sender = (newSender === null)?sender:newSender;//update the data. if empty string is given, keep the original.
        friendRequests[reqIndex].receiver = (newReceiver === null)?receiver:newReceiver;
        const messageIndex = reqMessages.findIndex(message=>message.id === friendRequests[reqIndex].message);
        const {text} = reqMessages[messageIndex];
        reqMessages[messageIndex].text = (newMessage === null)?text:newMessage;
        return friendRequests[reqIndex];//return the object!
    }
};

export default Mutation;