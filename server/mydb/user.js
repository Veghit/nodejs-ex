

class  user
{
    constructor(fb_id, f_name, friends_list, location){
        this.fb_id = fb_id
        this.f_name = f_name
        this.friends_list = friends_list
        this.open_friends_events = []
        this.invited_events = []
        this.going_events = []
        this.own_public_events = []
        this.own_private_events = []
        this.created_events = 0
        this.current_location = location
    }
}

module.exports = user
