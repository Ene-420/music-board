import { Track, TrackCover } from '../model/track.js';
import { User, UserAlbum } from '../model/user.js';

const pool = require('./pool.js')
//const {Track, TrackCover} = require('../model/track.js')
//const {User} = require('../model/user.js')


async function insertIntoSongTable(Track){
    await pool.query('INSERT INTO song VALUES($1, $2, $3, $4, $5, $6, $7)', [Track.songID, Track.title, Track.artistID, Track.artistID, Track.artistName, Track.duration, Track.albumID, Track.albumName])
}

async function insertIntoTrackCover(TrackCover){
    await pool.query('INSERT INTO songCover VALUES($1,$2,$3,$4,$5)', [TrackCover.coverID, TrackCover.albumID, TrackCover.cover, TrackCover.cover_medium, TrackCover.cover_large])
}

async function addToUserLibrary(userID, trackID, albumID, coverID){
    await pool.query('INSERT INTO useralbums VALUES($1, $2, $3, $4, $4)', [userID, albumID, trackID, coverID ])
}

module.exports = {insertIntoSongTable, insertIntoTrackCover, addToUserLibrary};