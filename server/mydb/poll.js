



class  poll
{
    constructor(owner_id, poll_question, options_array, array_length, poll_id){
        this.poll_id = poll_id
        this.owner_name = owner_id
        this.poll_question = poll_question
        this.options = []
        this.voted_users = []
        for(var i=0;i<array_length;i++)
        {
            this.options[i] = {option: options_array[i] , votes: 0}
        }

        this.array_length = array_length

    }
}

module.exports = poll
