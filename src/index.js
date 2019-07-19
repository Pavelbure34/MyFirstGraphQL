import {GraphQLServer} from 'graphql-yoga';

/*
    With nodemon installed, you can actively update the server without turning it off.
    type definitions: application schema(data type, operations).
    without !: it is optional.
    with !: it must be certain type.(required)
*/
const typeDefs = `
    type Query{
        org:String!
        id:ID!
        active:Boolean!
        year:Int!
        review:Float
        bankStatus:Float!
    }
`;

/*
    Scalar Value: type that stores single value.
        Five Main Types of data
            1.String: you know what that is
            2.Boolean: true or false
            3.Int: integer value. number
            4.Float: decimal values
            5.ID: represent identifiers(similar to String)
*/

//Resolvers:set of functions
const resolvers = {
    Query:{
        //this have to match with typeDefs
        org(){
            return 'Defunct Co.';
        },
        id(){
            return 'AAB004';
        },
        active(){
            return false; 
        },
        year(){
            return 2017;
        },
        review(){
            return;
        },
        bankStatus(){
            return 3.5;
        }
    }
}

//graphQLServer needs two parameters:
//object whose properties are typedefs and resolvers
const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(()=>{
    //callback functions to tell server is running right.
    console.log("server is running....");
});