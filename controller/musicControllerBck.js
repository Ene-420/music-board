//Controller for backend 

// DB Schema 
const User = require('../model/user.js');
const Artist = require('../model/artist.js');
const Album = require('../model/album.js');
const Song = require('../model/song.js');

const apiSearchQueryResponse = [];    ///Save Api search result
const transformedApiResponse = [];      ///Save transformed API response


async function callBackend(query){
  const {query, source} = query;

  try{
    if (source.includes('library')){
      return await queryResult(query)
    }
    else{
      return await makeApiCall(query)
        }
  }
  catch(error){
    console.log(`Error: ${error}`)
  }


}


// transform API response to match DB schema
async function transformApiResult(data){
  try{
    if (data.total < 1){
      return new Error('No data found')
    }
    else{
      return data.data.map(item =>{
        if(item.title.includes(item.album.title)){
          return new Song({
            _id: item.id,
            title: item.title,
            artist: item.artist.name,
            album_id: item.album.id,
            album_name: item.album.title,
            duration: item.duration,
            preview: item.preview,
            song_art:{
              cover: item.album.cover,
              cover_medium: item.album.cover_medium,
              cover_large: item.album.cover_large
            }
          })
        }
      

        else{
          return new Album({
            _id: item.album.id,
            title: item.album.title,
            artist_id: item.artist.id,
            song_ids:[item.id],
            album_art:{
              cover: item.album.cover,
              cover_medium:item.album.cover_medium,
              cover_large:item.album.cover_large
            }
          })
        }
      })
  
    //return transformedApiResponse
    }
  }catch(error){
    console.log(`Error: ${error}`)
    return new Error('Error transforming data')
  }

}
// #region DB
// Query database for entries matching query
async function queryResult(query){
    try {
      const [albumResult, songResult, artistResult] =  await Promise.all([
        Album.find({title: `${query}`}),
        Song.find({title:`${query}`}),
        Artist.find({name: `${query}`}),
      ]);
      return [...albumResult, ...songResult, ...artistResult ]
  
    } catch (error) {
      console.log(error)
    }
  }
  // #endregion

// #region API
  //uses search bar query to make API request
  async function makeApiCall(query){
    const fetch = require('node-fetch');

    const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${query}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.RAPID_API_KEY,
        'x-rapidapi-host': process.env.RAPID_API_HOST
      }
    };
  
    try {
      const response = await fetch(url, options);
      const result = await response.text();
      apiSearchQueryResponse = [...result]
      transformedApiResponse = [...transformApiResult(result)]

      return  result;
    } catch (error) {
      console.error(error);
    }
  }
// #endregion

// #region User
  // save album to user library
  async function saveToUserAlbumLibrary(userID, albumID){
    await User.updateOne(
      {userID},
      {$addToSet:{'library.album': albumID} },
      {upsert: true}
    ).then()
    .then()
    .catch(error => {
      console.log(`Error: ${error}`)
    })
  }

  // save single to user library
  async function saveToUserSingleLibrary(userID, trackID){
      await User.updateOne(
        {userID},
        {$addToSet:{'library.singles': trackID} },
        {upsert: true}
      ).then()
      .then()
      .catch(error => {
        console.log(`Error: ${error}`)
      })
  }
  //save artist to user library
  async function saveToUserArtistLibrary(userID, artistID){
    await User.updateOne(
      {userID},
      {$addToSet:{'library.artists':artistID}},
      {upsert: true}
    ).then()
    .then()
    .catch(error => {
      console.log(`Error: ${error}`)
    })
  }
// #endregion

// #region Song
// Get singles in DB
/*async function getSingleFromDB(userID, query){
    try {
      const userSingleList = [];
      const userSinglesID = await User.find({
        {id:userID },
      })
      userSinglesID.library.singles.forEach(item => {
        const song = Song.find({
          {id:item}
        })
        userSingleList.push(song)
      });
      return userSingleList;
  }
  catch(error){
    console.log(`Error: ${error}`);
  }
}*/
  // Save song to DB
async function saveSingleSongToDB(index){
  const songItem = apiSearchQueryResponse[index];
  const song = new Song({
    _id: songItem.id,
    title: songItem.title,
    artist: songItem.artist.name,
    album_id: songItem.album.id,
    album_name: songItem.album.title,
    duration: songItem.duration,
    preview: songItem.preview,
    song_art:{
      cover: songItem.album.cover,
      cover_medium: songItem.album.cover_medium,
      cover_large: songItem.album.cover_large
    } 
  });
  song.save()
  .then()
  .then()
  .catch(error =>{
    console.log(`Error: ${error}`)
  })
}
  
  // #endregion

// #region Album

// get albums from DB
/* async function getAlbumFromDB(userID){
    try {
      const userAblumList = [];
      const userAblumsID = await User.find({
        {id:userID }
      })
      userAblumsID.library.album.forEach(item => {
        const album = Album.find({
          {id:item}
        })
        userAblumList.push(album)
      });
      return userAblumList;
  }
  catch(error){
    console.log(`Error: ${error}`)
  }
} */
  /// Save to album in DB
  async function saveToAlbumInDB(albumId,songId){
    await Album.updateOne(
      {albumId}, 
      {$addToSet: {song_ids:songId}},
      {$upsert: true}

    ).then()
    .catch(error => {
      console.log(`Error: ${error}`)
    });

  }

  /// Add New album/single to Library
  async function saveNewAlbumToDB(index){
    const albumItem = apiSearchQueryResponse[index];
    const album = new Album({
      _id: albumItem.album.id,
      title: albumItem.album.title,
      artist_id: albumItem.artist.id,
      song_ids:[albumItem.id],
      album_art:{
        cover: albumItem.album.cover,
        cover_medium:albumItem.album.cover_medium,
        cover_large:albumItem.album.cover_large
      }
    })
    await album.save()
    .then()
    .then()
    .catch(error => {
      console.log(`Error: ${error}`)
    })
  }
 // #endregion 

// #region Artist
  // Get artists from DB
/*   async function getArtistFromDB(userID){
    try {
      const userArtistList = [];
      const userArtistID = await User.find({
        {id:userID }
      })
      userArtistID.library.artists.forEach(item => {
        const artist = Artist.find({
          {id:item}
        })
        userArtistList.push(artist)
      });
      return userArtistList;
  }
  catch(error){
    console.log(`Error: ${error}`)
    }
}
 */  // Save artist to DB 
  async function saveArtistToDB(index){
    const artistItem = apiSearchQueryResponse[index];
    const artist = new Artist({
      _id:artistItem.artist.id,
      name:artistItem.artist.name,
      artist_art:{
        cover: artistItem.artist.picture,
        cover_medium: artistItem.artist.picture_medium,
        cover_large:artistItem.artist.picture_large
      }
    })

    await artist.save()
    .then()
    .catch(error => {
      console.log(`Error: ${error}`)
    });

  }
// #endregion
  //Apply async to API requests, Form handling, and Database requests

module.exports = {
    callBackend,
    saveToUserAlbumLibrary,
    saveToUserSingleLibrary,
    saveToUserArtistLibrary,
    saveSingleSongToDB,
    saveToAlbumInDB,
    saveNewAlbumToDB,
    saveArtistToDB
}