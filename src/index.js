import {GraphQLServer} from 'graphql-yoga';
//excellent module for graphQL development both for produciton and testing.

/*
    With nodemon installed, you can actively update the server without turning it off.
    type definitions: application schema(data type, operations).
    without !: it is optional.
    with !: it must be certain type.(required)

    How to pass data from Client to Server
    
*/
const typeDefs = `
    type Query{
        org:String!
        id:ID!
        active:Boolean!
        year:Int!
        review:Float
        bankStatus:Float!
        Me:Stat!
        Other:[Enemy!]!
    }

    type Stat{
        id:ID!
        DEX:Int!
        DEF:Int!
        ATT:Int!
    }

    type Enemy{
        id:ID!
        HP:Int!
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
    Custom Type data: our own custom data.
        1. every custom data should start with capital letter.
        2.In Resolver it should return the object which is  in sync
            with typeDefs

*/

//Resolvers:set of functions
const resolvers = {
    Query:{
        //this have to match with typeDefs
        org(){//String type
            return 'Defunct Co.';
        },
        id(){//ID type
            return 'AAB004';
        },
        active(){//Boolean type
            return false; 
        },
        year(){//Int type
            return 2017;
        },
        review(){//Float Type
            return;
        },
        bankStatus(){//Float Type
            return 3.5;
        },
        Me(){//Custom Type
            return {//usually data query from db is done here.
                id:'myStat',
                DEX:35,
                DEF:30,
                ATT:40
            };
        },
        Other(){//using arrays and custom type.
            return [
                {
                    id:'ABB01',
                    HP:10
                },
                {
                    id:'ABB02',
                    HP:15
                }
            ]
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