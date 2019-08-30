const friendRequest = {
    sender({sender}, args, {db}, info){
        return db.players.find((player)=>player.name === sender);
    },
    receiver({receiver}, args, {db}, info){
        return db.players.find((player)=>player.name === receiver);
    },
    message({message},args, {db}, info){
        return db.reqMessages.find((reqMessage)=>reqMessage.id === message);
    }
};

export default friendRequest;