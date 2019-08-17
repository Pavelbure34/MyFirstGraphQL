import Query from './Query';
import Mutation from './Mutation';
import player from './player';
import log from './log';
import friendRequest from './friendRequest'; 

/*
    This is resolvers which is a set of functions.
    and it has to match typeDefs in order to
    make graphQL work 
 */
export default {
    Query,
    Mutation,
    player,
    log,
    friendRequest
};