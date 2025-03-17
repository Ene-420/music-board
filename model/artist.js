const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const artistSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
  name:{
        type: String,
        required: true
  },
  artist_art:{
    
    cover:{type:String, required:true},
    cover_medium:{type:String, required:true},
    cover_large:{type:String, required:true},  
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
    required: false

  }
}, {timestamps: true});

const Artist = mongoose.model('Artist', artistSchema);
module.exports = Artist;
