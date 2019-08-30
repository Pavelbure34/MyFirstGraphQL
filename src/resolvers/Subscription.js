const Subscription = {
    count:{//this has to be object not method.
        subscribe(parent, args, {pubsub}, info){
            /*
                For example dummy subscription,
                we will get incrementing number by seconds
                with the subscription feature.
            */
            let count = 0;
            /*
                2.publish data
                Instead of returning the scalar value, we return pubsub operation.
                This time, we use asyncIterator which takes one argument 'channel name' which
                is a string similar to chat room name in Kakao.
             */
            setInterval(()=>{
                count++;//increment the count.
                /*
                    here we publish our data.publish method takes two argument.
                        1.channel name which we have to match.
                        2.data we are gonna publish.
                */
                pubsub.publish('count',
                {//this data is to be flowing in!
                   count//publish the count data which has to match the type in schema
                });
            },3000);//interval with 3 seconds
            return pubsub.asyncIterator('count');//argument is the channel name.
        }
    },
    reqNotify:{
        subscribe(parent,{receiver},{pubsub, db},info){
            const reqs = db.friendRequests.find(req=>req.receiver === receiver);
            if (!reqs)//if receiver is not found, throw new error.
                throw new Error("friend request not found.");
            return pubsub.asyncIterator(`friendReq ${receiver}`);//argument is channel name.            
        }
    }
}

export default Subscription;