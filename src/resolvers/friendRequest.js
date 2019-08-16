const friendRequest = {
    sender(parent, args, {db}, info){
        return db.players.find((player)=>player.name === parent.sender);
    },
    receiver(parent, args, {db}, info){
        return db.players.find((player)=>player.name === parent.receiver);
    },
    message(parent,args, {db}, info){
        return db.reqMessages.find((reqMessage)=>reqMessage.id === parent.message);
    }
};

export default friendRequest;