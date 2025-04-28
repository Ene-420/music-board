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
    id:{type: Number, required:true},
    name:{type: String, required:true},
  },
  song:{
    title:{type: String, required:true},
    id:{type: Number, required:true},
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
    cover_xl:{type:String, required:false}
  },
  inLibrary:Boolean

}, {timestamps:true})

const Song = mongoose.model('Song', songSchema);
module.exports = Song;