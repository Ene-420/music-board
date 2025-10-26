
class Track {
    constructor(albumID, songID, title, artistID, artistName, duration){
    this.albumID= albumID;
    this.songID = songID;
    this.title = title;
    this.artistID = artistID;
    this.artistName = artistName;
    this.duration = duration;
    }
}

module.exports = {Track}
