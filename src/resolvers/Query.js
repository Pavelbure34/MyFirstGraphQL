/*
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

const Query = {
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
    Logs(parent, {id}, {db}, info){
        const {Logs} = db;
        return (id === "" || !id)?Logs:
            Logs.filter(
                (log)=>log.id === id
            );
    },
    friendRequests(parent, {sender, receiver}, {db}, info){
        const {friendRequests} = db;
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
    reqMessages(parent, args, {db}, info){
        return db.reqMessages;
    },
    greeting(parent, args, ctx, info){//another example of client to server
        const {name, age} = args;
        return `I am ${name} and ${age} years old`; //can work this way too!
    },
    Players(parent, {data}, {db}, info){//array of type. 
        const {players} = db;
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
};

export default Query;