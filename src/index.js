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
        class:'Wizard'
    },
    {
        id:'AVX330',
        name:'Dominik',
        level:'30',
        class:'Archer'
    },
    {
        id:'ABC001',
        name:'Sam',
        level:'50',
        class:'Warrior'
    }
]

const typeDefs = `
    type Query{
        org:String!
        id:ID!
        active:Boolean!
        year:Int!
        review:Float
        bankStatus:Float!
        greeting(
            name:String!,
            age:Int!
        ):String!
        players(query:String,item:String):[player!]!
    }

    type player{
        id:ID!
        name:String!
        level:Int!
        class:String!
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
        review(){//Float Type
            return;
        },
        bankStatus(){//Float Type
            return 3.5;
        },
        greeting(parent, args, ctx, info){//another example of client to server
            const {name, age} = args;
            return `I am ${name} and ${age} years old`; //can work this way too!
        },
        players(parent, args, ctx, info){//array of type.
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
                    return (item === "id")?player.id.toLowerCase().includes(query.toLowerCase())
                        :(item === "name")?player.name.toLowerCase().includes(query.toLowerCase()):
                        (item === "level")?player.level.toLowerCase().includes(query.toLowerCase())
                        :(item === "class")?player.class.toLowerCase().includes(query.toLowerCase()):
                        {id:'none',name:'none',level:-1,class:'none'} 
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