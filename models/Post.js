const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    postImage:{
        type: String
    },
    status:{
        type: String,
        required: true,
        default: 'public'
    },
    description:{
        type: String,
        required: true
    },
    allowComments:{
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',
        required: true
    },
    user:{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'users',
    //     required: true,
    }
});

module.exports = mongoose.model('Posts',PostSchema);