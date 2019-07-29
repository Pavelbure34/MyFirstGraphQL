import {GraphQLServer} from 'graphql-yoga';
//excellent module for graphQL development both for produciton and testing.

/*
    With nodemon installed, you can actively update the server without turning it off.
    type definitions: application schema(data type, operations).
    without !: it is optional.
    with !: it must be certain type.(required)

    How to pass data from Client to Server(Argument Operation)
        use () brackets to the query item.
        put your own item back in () when querying on the client.
*/

//real life examples data
const players = [
    {
        id:'FVD400',
        name:'Mark',
        level:'45',
        occupation:'Wizard',
        Log:'1'
    },
    {
        id:'AVX330',
        name:'Dominik',
        level:'30',
        occupation:'Wizard',
        Log:'2'
    },
    {
        id:'ABC001',
        name:'Sam',
        level:'50',
        occupation:'Wizard',
        Log:'3'
    }
]

const Logs = [//sample data for relationship between two data types.
    {
        id:'1',
        last_access:'1400'
    },
    {
        id:'2',
        last_access:'1500'
    },
    {
        id:'3',
        last_access:'0700'
    }
]

//this is schema for graphQL.
const typeDefs = `
    type Query{
        org:String!
        id:ID!
        active:Boolean!
        year:Int!
        review:Float
        bankStatus:Float!
        Logs(id:String):[log!]!
        greeting(
            name:String!,
            age:Int!
        ):String!
        Players(
            item:String,
            query:String
        ):[player!]!
    }

    type player{
        id:ID!
        name:String!
        level:Int!
        occupation:String!
        Log:log!
    }

    type log{
        id:ID!,
        last_access:String!
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
        3.In Resolver,there can be four types of argument.
            parent = useful for relational DATA(SQL!!)
            args = contains information for argument
            ctx = useful for contextual data(logged in? or not)
            info = great information about the operation. 

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
        review(){//Float Type without !
            return;
        },
        bankStatus(){//Float Type
            return 3.5;
        },
        Logs(parent,args,ctx,info){
            const {id} = args;
            return (id === "" || !id)?Logs:
                Logs.filter((log)=>{
                    return log.id === id;
                });
        },
        greeting(parent, args, ctx, info){//another example of client to server
            const {name, age} = args;
            return `I am ${name} and ${age} years old`; //can work this way too!
        },
        Players(parent, args, ctx, info){//array of type.
            const {item,query} = args;//always make destructure when using more than once. 
            if (!query && !item)     //if query and item is not given
                return players;      //just show the whole items.
            else
                return players.filter((player)=>{
                    /*
                        this allows filter the search insteand of showing everything in the array.
                        lowercase search is always recommended in order to prevent case sensitive cases.
                        In this case, we are searching players by their names.
                    */
                   const {id, name, level, occupation} = player;
                    return (item === "id")?id.toLowerCase().includes(query.toLowerCase())
                        :(item === "name")?name.toLowerCase().includes(query.toLowerCase()):
                        (item === "level")?level.toLowerCase().includes(query.toLowerCase())
                        :(item === "occupation")?occupation.toLowerCase().includes(query.toLowerCase()):
                        {id:'none',name:'none',level:-1,occupation:'none'} 
                })
        }
    },
    player:{
        Log(parent,args,ctx,info){
            return Logs.find((Log)=>{
                return Log.id === parent.Log;
            })
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