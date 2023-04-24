const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true,
    }, 
    is_completed: {
        type:String,
        required: true,
    }
})

const Tasks = mongoose.model('task', taskSchema)
module.exports = Tasks;