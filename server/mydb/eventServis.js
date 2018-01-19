const DB = require('../data/DB')
const eventDAO = require('./eventDAO')
var Event = require('./event')



class eventService {

    addEvent(owner_id, location, type, info) {
        return new Promise((resolve, reject) => {
            let new_event = new Event(fb_id, first_name, last_name, friends_list)
            eventDAO.create_event(new_event)
                .then(_=> {
                    console.log('saved! ', new_event)
                    resolve()
                }).catch(err => reject(err))
        })
    }

    // getAllUsers() {
    //     return userDAO.get_all_users()
    // }
}

module.exports = new eventService()
