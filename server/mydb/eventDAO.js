const DB = require('../data/DB');

class eventDAO
{

    create_event(event)
    {
      return DB.db.collection('events').insertOne(event) //returns a Promise
    }

    get_event(eventId)
    {
        return DB.db.collection('events').find(
            {"eventId" :  eventId}).toArray()  //returns a Promise
    }

    get_all_events()
    {
        return DB.db.collection('events').find().toArray()  //returns a Promise
    }

    update_event(event_id, updeted_event)
    {
        console.log(updeted_event)
        return DB.db.collection('events').updateOne({'eventId' : event_id},updeted_event) //returns a Promise
    }

    remove_event(event_id)
    {
        console.log('DAO - deleting event:', event_id)
        return DB.db.collection('events').deleteOne(
            {"eventId" :  event_id})
    }





}

module.exports = new eventDAO()
