const pool = require('./pool.js')
const {Track, TrackCover} = require('../model/track.js')


async function insertIntoSongTable(Track){
    await pool.query('INSERT INTO song VALUES($1, $2, $3, $4, $5, $6, $7)', [Track.songID, Track.title, Track.artistID, Track.artistID, Track.artistName, Track.duration, Track.albumID, Track.albumName])
}

async function insertIntoTrackCover(TrackCover){
    await pool.query('INSERT INTO songCover VALUES($1,$2,$3,$4,$5)', [TrackCover.coverID, TrackCover.albumID, TrackCover.cover, TrackCover.cover_medium, TrackCover.cover_large])
}

module.exports = {insertIntoSongTable, insertIntoTrackCover}