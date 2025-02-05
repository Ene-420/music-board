const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const songSchema = new Schema({
    _id: {
        type: Number,
        required:true
    },
  title: {
        type: String,
        required:true
  },
  artist:{
      type: String,
      required:true
  },

  album_id: {
        type: Number,
        required:true
  },
  album_name:{
      type: String,
      required: true
  },

  duration:{
     type: Number,
     required: true 
  },
  preview:{
      type: String,
      required: true
  },

  song_art:{ 
    cover:{type:String, required:false},
    cover_medium:{type:String, required:false},
    cover_large:{type:String, required:false},
  }

}, {timestamps:true})

const Song = mongoose.model('Song', songSchema);
module.exports = Song;