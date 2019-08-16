import {GraphQLServer} from 'graphql-yoga';//module for graphQL development both for produciton and testing.
import resolvers from './resolvers';
import db from './db';                     //separate file for database

/*
    With nodemon installed, you can actively update the server without turning it off.
    type definitions: application schema(data type, operations).
    without !: it is optional.
    with !: it must be certain type.(required)

    How to pass data from Client to Server(Argument Operation)
        use () brackets to the query item.
        put your own item back in () when querying on the client.
*/

/*
    this is schema for graphQL.

    How to mutate pre-existed data,
    write type Mutate{} and fill in all the data
    you want to mutate within the curly brackets. 

    When you have so many arguments, it will be hassel to write them down.
    In order to make it easier, you can use input type. Since the argument can
    only take object or scalar-type data, here is a way.

        input NAME{
            ...properties
        }
    When you apply them,
        mutationOperation(data:NAME){
            ...
        }
    In Resolver,use args.data instead of args. and it has to be input type.

    How to delete data in graphQL
    You gotta remember that, when player 1 is deleted, log and other player 1 related data
    are also to be deleted altogether. Delete operation is within the mutation.
        deletePlayer(id:ID!):player!
    Like this, you write the same in the typeDefs.Now in he resolvers,
 */

/*
    Scalar Value: type that stores single value.
        Five Main Types of data
            1.String: you know what that is
            2.Boolean: true or false
            3.Int: integer value. number
            4.Float: decimal values
            5.ID: represent identifiers(similar to String)
    Custom Type data: our own custom data.
        1. every custom data should start with capital letter.
        2.In Resolver it should return the object which is  in sync
            with typeDefs
        3.In Resolver,there can be four types of argument.
            parent = useful for relational DATA(SQL!!)
            args = contains information for argument
            ctx = useful for contextual data(logged in? or not)
            info = great information about the operation. 

*/

//graphQLServer needs two parameters:
//object whose properties are typedefs and resolvers
const server = new GraphQLServer({
    typeDefs:'./src/schema.graphql',//path to the schema file!
    resolvers,
    context:{//context is for universal datas which app should share.
        db
    }
});

server.start(()=>{
    //callback functions to tell server is running right.
    console.log("server is running....");
});