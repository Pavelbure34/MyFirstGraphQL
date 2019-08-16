import {GraphQLServer} from 'graphql-yoga';//module for graphQL development both for produciton and testing.
import uuidv4 from 'uuid/v4';              //module for random id generation

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
let players = [
    {
        id:'FVD400',
        email:'markWahlberg@hollywood.com',
        name:'Mark',
        occupation:'Wizard',
        level:'45',
        Logs:'FVD400',
        friendReqSent:'Mark',
        friendReqReceive:'Mark'
    },
    {
        id:'AVX330',
        email:'DominikThiem@Tennis.net',
        name:'Dominik',
        occupation:'Wizard',
        level:'30',
        Logs:'AVX330',
        friendReqSent:'Dominik',
        friendReqReceive:'Dominik'
    },
    {
        id:'ABC001',
        email:'SamMendes@director.com',
        name:'Sam',
        occupation:'Wizard',
        level:'50',
        Logs:'ABC001',
        friendReqSent:'Sam',
        friendReqReceive:'Sam'
    }
]

let Logs = [//sample data for relationship between two data types.
    {
        id:'1',
        last_access:'1400',
        player:'FVD400'
    },
    {
        id:'2',
        last_access:'1500',
        player:'AVX330'
    },
    {
        id:'3',
        last_access:'0700',
        player:'ABC001'
    },
    {
        id:'4',
        last_access:'2100',
        player:'ABC001'
    },
    {
        id:'5',
        last_access:'2000',
        player:'AVX330'
    },
    {
        id:'6',
        last_access:'2300',
        player:'FVD400'
    }
]

let friendRequests = [//another sample data for relationship between two data types.
    {
        id:'1',
        sender:'Mark',
        receiver:'Dominik'
    },
    {
        id:'2',
        sender:'Mark',
        receiver:'Sam'
    },
    {
        id:'3',
        sender:'Sam',
        receiver:'Mark'
    },
    {
        id:'4',
        sender:'Sam',
        receiver:'Dominik'
    }
]

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
const typeDefs = `
    type Query{
        org:String!
        id:ID!
        active:Boolean!
        year:Int!
        review:Float
        bankStatus:Float!
        friendRequests(
            sender:String,
            receiver:String
        ):[friendRequest!]!
        Logs(id:String):[log!]!
        greeting(
            name:String!,
            age:Int!
        ):String!
        Players(data:queryPlayerInput):[player!]!
    }

    type Mutation{
        createPlayer(data:createPlayerInput!):player!
        sendRequest(data:createRequestInput!):friendRequest!
        deletePlayer(id:ID!):player!
    }

    input queryPlayerInput{
        item:String!,
        query:String!
    }   

    input createPlayerInput{
        email:String!,
        name:String!,
        occupation:String!
    }

    input createRequestInput{
        sender:String!,
        receiver:String!
    }

    type player{
        id:ID!
        email:String!
        name:String!
        occupation:String!
        level:Int!
        Logs:[log!]!
        friendReqSent:[friendRequest!]!
        friendReqReceive:[friendRequest!]!
    }

    type log{
        id:ID!
        last_access:String!
        player:player!             
    }

    type friendRequest{
        id:ID!
        sender:player!
        receiver:player!
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

/*
    Resolvers:set of functions
    these have to match with typeDefs
 */
const resolvers = {
    Query:{
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
                Logs.filter(
                    (log)=>log.id === id
                );
        },
        friendRequests(parent,args,ctx,info){
            const {sender,receiver} = args;   //not using input type.
            return (!sender && !receiver)?friendRequests:
                (!receiver)?friendRequests.filter((request)=>{
                    return request.sender.toLowerCase().includes(sender.toLowerCase()); 
                }):(!sender)?friendRequests.filter((request)=>{
                    return request.receiver.toLowerCase().includes(receiver.toLowerCase());
                }):friendRequests.filter((request)=>{
                    return (sender.toLowerCase().includes(request.sender.toLowerCase()) && 
                        receiver.toLowerCase().includes(request.receiver.toLowerCase())
                    )?request:{};//this needs to be fixed!
                });
        },
        greeting(parent, args, ctx, info){//another example of client to server
            const {name, age} = args;
            return `I am ${name} and ${age} years old`; //can work this way too!
        },
        Players(parent, args, ctx, info){//array of type. 
            const data = args.data;
            if (!data)     //if query and item is not given
                return players;      //just show the whole items.
            else
                return players.filter((player)=>{
                    /*
                        this allows filter the search insteand of showing everything in the array.
                        lowercase search is always recommended in order to prevent case sensitive cases.
                        In this case, we are searching players by their names.
                    */
                   const {item,query} = data;//always make destructure when using more than once.
                   const {id, email, name, level, occupation} = player;
                    return (item === "id")?id.toLowerCase().includes(query.toLowerCase())
                        :(item === "email")?email.toLowerCase().includes(query.toLowerCase())
                        :(item === "name")?name.toLowerCase().includes(query.toLowerCase())
                        :(item === "level")?level.toLowerCase().includes(query.toLowerCase())
                        :(item === "occupation")?occupation.toLowerCase().includes(query.toLowerCase()):
                        {
                            id:'none',
                            name:'none',
                            level:-1,
                            occupation:'none'
                        } 
                })
        }
    },
    Mutation:{//this allows changing making new data into your db.
        createPlayer(parent,args,ctx,info){
            const {name, email} = args.data;
            //if emails are already being used, throw an error to the client.
            if (players.some((player)=>player.email === email))
                throw new Error('Emails are already being used.');
            const id = uuidv4(); //generating random ID for a new player
            /*  Using spread-rest operation, these can be directly copied into.
                const args = {       
                    email:email,
                    name:name,
                    occupation:occupation
                };
            */
            const new_player = { //new player created.
                id:id,
                ...args.data,         //copying properties from copy
                level:1,
                Logs:id,
                friendReqSent:name,
                friendReqReceive:name
            };
            players.push(new_player);//adding new user to the player array.
            return new_player;       //returning the player we just created
        },
        sendRequest(parent,args,ctx,info){
            const {sender,receiver} = args.data;
            if (players.some((player)=>player.name.toLowerCase()===sender.toLowerCase()) === false)
                throw new Error("sender not in the player database");
            else if (players.some((player)=>player.name.toLowerCase()===receiver.toLowerCase()) === false)
                throw new Error("receiver not in the player database");
            /*using transform-object-rest-spread
                  const copy = {             
                    sender:sender,
                    receiver:receiver
                };
            */
            const new_request = {
                id:uuidv4(),
                ...args.data              //copying properties from copy
            };
            friendRequests.push(new_request);
            return new_request;
        },
        deletePlayer(parent,args,ctx,info){//deletion Operation
            const playerIndex = players.findIndex((player) => player.id === args.id); 
            if (playerIndex === -1)//1. check if the matching user exists
                throw new Error("Player not found.");
            /*
                when a matching player exists,
                    1. delete a player from player database set
                    2. delete other data in other database sets which a deleted player is related  
                    3. return the deleted user data.
             */
            const deletedPlayer = players.splice(playerIndex, 1);                   //splice method returns returns the array of deleted items by default
            //players = players.filter((player)=>player.id !== deletedPlayer[0].id); equivalent to this but without returning deleted data.
            const {name,id} = deletedPlayer[0];
            Logs = Logs.filter((log)=> log.player !== id);          //deleting related data
            friendRequests = friendRequests.filter((request)=>
                request.sender !== name || request.receiver !== name); 
            return deletedPlayer[0];
        }
    },
    player:{//log data has player. so we need to specify the relationship.
        Logs(parent,args,ctx,info){
            return Logs.filter(
                (Log)=>Log.player === parent.Logs
            )
        },
        friendReqSent(parent,args,ctx,info){
            return friendRequests.filter(
                (request)=>request.sender === parent.friendReqSent //simpler syntax
            )
        },
        friendReqReceive(parent,args,ctx,info){
            return friendRequests.filter(
                (request)=>request.receiver === parent.friendReqReceive
            )
        }
    },
    log:{//log data has player. so we need to specify the relationship.
        player(parent,args,ctx,info){
            return players.find(
                (player)=>player.id === parent.player
            );
        }
    },
    friendRequest:{
        sender(parent,args,ctx,info){
            return players.find((player)=>player.name === parent.sender);
        },
        receiver(parent,args,ctx,info){
            return players.find((player)=>player.name === parent.receiver);
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