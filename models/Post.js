const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title:{
        type:String,
        maxlength: 5,
        required: true
    },
    status:{
        type:String,
        required:true,
        default: 'public'
    },
    description:{
        type:String,
        required:true
    },
    allowComments:{
        type:Boolean,
        required: true
    },
    user:{
         type: mongoose.SchemaTypes.ObjectId,
         ref: 'users',
    //     required: true,
    }
});

module.exports = mongoose.model('Posts',PostSchema);