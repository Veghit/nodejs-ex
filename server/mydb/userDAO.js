const DB = require('../data/DB');

class userDAO
{
    update_user(user_fb_id, updeted_user)
    {
        return DB.db.collection('usrs').updateOne({'fb_id' : user_fb_id},updeted_user) //returns a Promise
    }
    update_friend_list(user_fb_id, new_friends_list)
    {
        return DB.db.collection('usrs').updateOne({'fb_id' : user_fb_id},{$set: {'friends_list' : new_friends_list} }) //returns a Promise
    }
    update_user_created_events(user_fb_id, created_events_count)
    {
        return DB.db.collection('usrs').updateOne({'fb_id' : user_fb_id},{$set: {'created_events' : created_events_count} }) //returns a Promise
    }
    update_user_own_public_events(user_fb_id, own_public_events)
    {
        return DB.db.collection('usrs').updateOne({'fb_id' : user_fb_id},{$set: {'own_public_events' : own_public_events} }) //returns a Promise
    }
    update_invited_events(user_fb_id, invited_events)
    {
        return DB.db.collection('usrs').updateOne({'fb_id' : user_fb_id},{$set: {'invited_events' : invited_events}}) //returns a Promise
    }

    insert_user(user)
    {
        return DB.db.collection('usrs').insertOne(user) //returns a Promise
    }

    get_user(userId)
    {
        return DB.db.collection('usrs').find(
          {"__id" :  ObjectId(userId)})  //returns a Promise
    }

    get_User_by_fb_id(id)
    {
        return DB.db.collection('usrs').find({"fb_id" : id }).toArray()  //returns a Promise
    }

    get_all_users()
    {
        return DB.db.collection('usrs').find().toArray()  //returns a Promise
    }

    get_user_invited_events(userId)
    {
        return DB.db.collection('usrs').find(
          {__id: ObjectId(userId)},
          {__id:0, "invited_events":1}  ).toArray()  //returns a Promise
    }

    get_user_joined_events(userId)
    {
        return DB.db.collection('usrs').find(
          {__id: ObjectId(userId)},
          {__id:0, "going_events":1}  ).toArray()  //returns a Promise
    }

    get_user_owned_events(userId)
    {
        return DB.db.collection('usrs').find(
          {__id:  ObjectId(userId)},
          {__id:0, "own_events":1}  ).toArray()  //returns a Promise
    }

}

module.exports = new userDAO()
