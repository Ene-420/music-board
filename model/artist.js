class Artist{
constructor(artistID, artistName){
  this.artistID = artistID;
  this.artistName = artistName;
  }
}
class artistCover{
  constructor(artistID,artistName, cover, cover_medium, cover_large){
    this.artistID = artistID;
    this.artistName = artistName;
    this.cover = cover;
    this.cover_medium = cover_medium;
    this.cover_large = cover_large;
  }
}

module.exports = {Artist, artistCover}