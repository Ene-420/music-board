const mongoose = require('mongoose');
const Song = require('./song');
const Schema = mongoose.Schema;

const albumSchema = new Schema({
    _id: {
        type: Number,
        required:true
    },

  title: {
        type: String,
        required:true
  },
  artist_id: {
        type: String,
        required:true
  },
  song_ids: [{
    type: String,
    required: true,
  }],
  album_art:{
    
      cover:{type:String, required:true},
      cover_medium:{type:String, required:true},
      cover_large:{type:String, required:true},  
    }
}, {timestamps: true});

const Album = mongoose.model('Album', albumSchema);
module.exports= Album;