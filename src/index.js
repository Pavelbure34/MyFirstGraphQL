import {GraphQLServer} from 'graphql-yoga';//module for graphQL development both for produciton and testing.
import resolvers from './resolvers';
import context from './context';                      

/*
    With nodemon installed, you can actively update the server without turning it off.
    type definitions: application schema(data type, operations).
    without !: it is optional.
    with !: it must be certain type.(required)

    How to pass data from Client to Server(Argument Operation)
        use () brackets to the query item.
        put your own item back in () when querying on the client.

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

    './src/schema.graphql'
    this is schema for graphQL.

*/

//graphQLServer needs two parameters:
//object whose properties are typedefs and resolvers

const typeDefs = './src/schema.graphql';//path to the schema file! 
const server = new GraphQLServer({typeDefs, resolvers, context});

server.start(()=>{
    console.log("server is running...."); //callback functions to tell server is running right.
});