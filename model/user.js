const uuid = require('uuid');

class User{
    constructor(){
        this.userID = uuid.v4()
    }
}

class UserAlbum{
    constructor( userID, albumID, trackID, albumCoverID){
        this.albumID = albumID;
        this.userID = userID;
        this.trackID = trackID;
        this.albumCoverID = albumCoverID;
    }
}

module.exports = {User, UserAlbum}