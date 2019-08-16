const log = {//log data has player. so we need to specify the relationship.
    player(parent, args, {db}, info){
        return db.players.find(
            (player)=>player.id === parent.player
        );
    }
};

export default log;