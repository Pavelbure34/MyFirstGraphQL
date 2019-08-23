const player = {//log data has player. so we need to specify the relationship.
    Logs({Logs}, args, {db}, info){
        return db.Logs.filter(
            (Log)=>Log.player === Logs
        )
    },
    friendReqSent({friendReqSent}, args, {db}, info){
        return db.friendRequests.filter(
            (request)=>request.sender === friendReqSent //simpler syntax
        )
    },
    friendReqReceive({friendReqReceive}, args, {db}, info){
        return db.friendRequests.filter(
            (request)=>request.receiver === friendReqReceive
        )
    }
};

export default player;