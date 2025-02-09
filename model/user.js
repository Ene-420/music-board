const mongoose = require('mongoose');
const Song = require('./song');
const Album = require('./album');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    
    user_id: {
        type: String,
        required:true
    },
    library:{
        album:[{
            type: Number,
            required: false
        }],
        singles:[{
            type: Number,
            required: false
        }],
        artists:[{
            type: Number,
            required: false
        }]  

    }


}, {timestamps: true});

const User = mongoose.model('User', userSchema);
module.exports = User;