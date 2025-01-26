const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const albumSchema = new Schema({
    _id: {
        type: String,
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
  "song_ids": ["song001", "song002"]
})