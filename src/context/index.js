import {PubSub} from 'graphql-yoga';//module for graphQL development both for produciton and testing.
import db from './db';

const pubsub = new PubSub();
//include it in the context for the entire app can gain access to it.

//context is for universal datas which app should share.
export default {
    db,      //equivalent to db:db
    pubsub   //equivalent to pubsub:pubsub
};