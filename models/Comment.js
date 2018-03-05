const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    date:{
        type: Date,
        default: Date.now()
    },
    user:{
        type: mongoose.Schema.Types.ObjectId
    }
});

module.exports = mongoose.model('comments',commentSchema);