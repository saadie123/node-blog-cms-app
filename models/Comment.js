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
    approveComment:{
        type: Boolean,
        default: false
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'users'
    }
});

module.exports = mongoose.model('comments',commentSchema);