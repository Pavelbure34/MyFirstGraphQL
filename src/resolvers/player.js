const player = {//log data has player. so we need to specify the relationship.
    Logs(parent, args, {db}, info){
        return db.Logs.filter(
            (Log)=>Log.player === parent.Logs
        )
    },
    friendReqSent(parent, args, {db}, info){
        return db.friendRequests.filter(
            (request)=>request.sender === parent.friendReqSent //simpler syntax
        )
    },
    friendReqReceive(parent, args, {db}, info){
        return db.friendRequests.filter(
            (request)=>request.receiver === parent.friendReqReceive
        )
    }
};

export default player;