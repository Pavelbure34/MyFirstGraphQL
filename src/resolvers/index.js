import Query from './Query';
import Mutation from './Mutation';
import player from './player';
import log from './log';
import friendRequest from './friendRequest'; 
import Subscription from './Subscription';

/*
    This is resolvers which is a set of functions.
    and it has to match typeDefs in order to
    make graphQL work 
 */
export default {
    Query,
    Mutation,
    Subscription,
    player,
    log,
    friendRequest
};