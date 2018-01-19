const DB = require('../data/DB')
const eventDAO = require('./eventDAO')
const userDAO = require('./userDAO')
var Event = require('./event')



class eventService {

    addOpenEvent(owner_id, title ,location, type, info, time) {
        return new Promise((resolve, reject) => {
            userDAO.get_User_by_fb_id(owner_id).then(own_user=>{
                console.log('-----addOpenEvent-----')
                own_user[0].created_events+=1
                var event_id = owner_id + own_user[0].created_events
                var friends_list_name = []
                var promises = []
                var a_promise
                var counter = 0
                for (let i = 0; i < own_user[0].friends_list.length ; i++)
                {
                    console.log('trying ti add the user')
                    console.log(own_user[0].friends_list[i])
                    promises.push(userDAO.get_User_by_fb_id(own_user[0].friends_list[i]).then(friend=>{
                        if(friend.length > 0)
                        {
                            console.log('going to add a friend name')
                            console.log(friend[0].f_name)
                            console.log(counter)
                            friends_list_name[counter] = (friend[0].f_name)
                            console.log('friends_list_name[counter] = ', friends_list_name[counter])
                            counter++
                        }
                    }))

                }
                Promise.all(promises).then(_=>{
                    console.log('addOpenEvent - all promises came back')
                    let new_event = new Event(event_id, owner_id, title, location, type, info, time, own_user[0].friends_list, own_user[0].f_name, friends_list_name)
                    console.log('the new event is:')
                    console.log(new_event)
                    eventDAO.create_event(new_event)
                        .then(_=> {
                            let updated_own_open_event_list = own_user[0].own_public_events
                            updated_own_open_event_list.push(event_id)
                            userDAO.update_user_created_events(owner_id, own_user[0].created_events)
                            userDAO.update_user_own_public_events(owner_id,updated_own_open_event_list)
                            invite_users_to_my_open_event(event_id, own_user[0].friends_list)
                            resolve()
                        }).catch(err => reject(err))
                }).catch(err=> reject(err))

                })

        })
    }
    delete_my_event(event_id, user_id){
        console.log('--------delete_my_event--------')
        return new Promise((resolve, reject) => {
            userDAO.get_User_by_fb_id(user_id).then(user=>{
                var do_i_own_this_event = user[0].own_public_events.indexOf(event_id)
                if(do_i_own_this_event > -1)
                {
                    console.log('delete_my_event - geting the event')
                    eventDAO.get_event(event_id).then(event=>{
                        let promises = [];
                        let a_promise;
                        a_promise = remove_my_owned_event_from_my_list(user[0],do_i_own_this_event)
                        promises.push(a_promise)
                        for (let i = 0; i < event[0].going_users.length ; i++)
                        {
                            a_promise = remove_attending_event_from_my_list(event[0].going_users[i],event_id)
                            promises.push(a_promise)
                        }
                        for (let j = 0; j < event[0].invited_users.length ; j++)
                        {
                            a_promise = remove_invited_users_event_from_my_list(event[0].invited_users[j],event_id)
                            promises.push(a_promise)
                        }
                        a_promise =eventDAO.remove_event(event_id)
                        promises.push(a_promise)
                        Promise.all(promises).then(_=>{
                            resolve()
                        }).catch(err=> reject(err))
                    }).catch(err => reject(err))
                }
                else
                {
                    console.log('delete_my_event - user does not own this event')
                }
            }).catch(err => reject(err))
        })
    }
    getEvent(event_id) {
        return new Promise((resolve, reject) => {
            eventDAO.get_event(event_id)
                .then(requested_events=> {
                    resolve(requested_events[0])
                }).catch(err => reject(err))
        })
    }


}

module.exports = new eventService()

function remove_my_owned_event_from_my_list(user,event_location_in_my_array){
    console.log('remove_my_owned_event_from_my_list - going to deleting event at owner')
    return new Promise((resolve, reject) => {
        user.own_public_events.splice(event_location_in_my_array,1)
        userDAO.update_user(user.fb_id, user).then(_=>{
            console.log('user got his owned event removed')
            resolve()
        }).catch(err => reject(err))
    })
}


function remove_invited_users_event_from_my_list(user_id,event_id){
    console.log('remove_invited_users_event_from_my_list - going to deleting event at invited user')
    console.log(user_id)
    return new Promise((resolve, reject) => {
        userDAO.get_User_by_fb_id(user_id).then(user=>{
            if(user.length >0){
                user[0].invited_events.splice(user[0].invited_events.indexOf(event_id),1)
                console.log('going to update the next user')
                console.log(user[0])
                userDAO.update_user(user[0].fb_id, user[0]).then(_=>{
                    resolve()
                }).catch(err => reject(err))
            }
            else
            {
                resolve()
            }

        }).catch(err => reject(err))
    })
}

function remove_attending_event_from_my_list(user_id,event_id){
    console.log('remove_attending_event_from_my_list - going to deleting event at attending user')
    return new Promise((resolve, reject) => {
        userDAO.get_User_by_fb_id(user_id).then(user=>{
            if(user.length >0){
                user[0].going_events.splice(user[0].going_events.indexOf(event_id),1)
                userDAO.update_user(user[0].fb_id, user[0]).then(_=>{
                    resolve()
                }).catch(err => reject(err))
            }
            else{
                resolve()
            }
        }).catch(err => reject(err))
    })
}

function invite_users_to_my_open_event(event_id, invited_list){
    // console.log('invite_users_to_my_open_event')
    // console.log(event_id)
    // console.log(invited_list)
    for(var i=0; i < invited_list.length; i++)
    {
        add_an_event_to_user_invited_list(event_id, invited_list[i])
    }
}

function add_an_event_to_user_invited_list(event_id, user_id){
    userDAO.get_User_by_fb_id(user_id).then(invited_friend=>{
        if (invited_friend.length > 0)
        {
            let updated_events = invited_friend[0].invited_events
            if(updated_events.indexOf(event_id) < 0 )
            {
                updated_events.push(event_id)
                userDAO.update_invited_events(invited_friend[0].fb_id, updated_events)
            }
        }


    })
}
