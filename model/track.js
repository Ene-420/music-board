const uuid = require('uuid')

class Track {
    constructor(albumID,albumName, songID, title, artistID, artistName, duration){
    this.albumID= albumID;
    this.albumName = albumName;
    this.songID = songID;
    this.title = title;
    this.artistID = artistID;
    this.artistName = artistName;
    this.duration = duration;
    this.inLibrary = false;
    }
}

class TrackCover{
    constructor(albumID, cover, cover_medium, cover_large){
        this.coverID = uuid.v4()
        this.albumID= albumID;
        this.cover = cover;
        this.cover_medium = cover_medium;
        this.cover_large = cover_large;
    }
}

module.exports = {Track, TrackCover}
