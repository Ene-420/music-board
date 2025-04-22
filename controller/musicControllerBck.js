//Controller for backend 

// DB Schema 
const User = require('../model/user.js');
const Artist = require('../model/artist.js');
const Album = require('../model/album.js');
const Song = require('../model/song.js');

let apiSearchQueryResponse = [];    ///Save Api search result
let transformedApiResponse = [];      ///Save transformed API response
let transformedArtistResponse = [];   ///Save transformed Artist response


 async function callBackend(item){
  const {query, source} = item;

  try{
    if (source.includes('library')){
      return  queryResult(query)
    }
    else{
      console.log(transformedApiResponse.length) //1
      return await makeApiCall(query)
      }
  }
  catch(error){
    console.log(`Error: ${error}`)
  }


}

/// Usses Song ID to add song to library
async function addToLibrary(userID,ID){
  try{
    const item = transformedApiResponse.find(item => item._id === ID);
    if (item.song?.name){
        const resultSingleLibrary  = await saveToUserSingleLibrary(userID, item._id);
        const resultArtistLibrary = await saveToUserArtistLibrary(userID, item._id);
        console.log({resultSingleLibrary, resultArtistLibrary})
        return transformedApiResponse.map(item => item._id === ID ? item.inLibrary = true : item)
    }
    else{
        const resultAlbumLibrary = await saveToUserAlbumLibrary(userID, item._id, item.song_ids[0]);
        resultArtistLibrary = await saveToUserArtistLibrary(userID, item._id);
        console.log({resultAlbumLibrary, resultArtistLibrary})
        return transformedApiResponse.map(item => item._id === ID ? item.inLibrary = true : item)
    }

  }
  catch(error){
    console.log(`Error: ${error}`)
    return new Error('Error adding to library')
  }
}
// transform API response to match DB schema
function transformApiResult(data){
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
            artist:{
              name: item.artist.name,
              id: item.artist.id
            },
            song:{
              id: item.album.id,
              name: item.album.title,
            }, 
            duration: item.duration,
            preview: item.preview,
            song_art:{
              cover: item.album.cover,
              cover_medium: item.album.cover_medium,
              cover_large: item.album.cover_big,
              cover_xl: item.album.cover_xl
      
            },
            inLibrary: false
          })
        }
      

        else{
          return new Album({
            _id: item.album.id,
            title: item.title,
            artist:{
              id: item.artist.id,
              name: item.artist.name
            },
            album:{
              title: item.album.title,
              song_ids:[item.id],
            },
            album_art:{
              cover: item.album.cover,
              cover_medium:item.album.cover_medium,
              cover_large:item.album.cover_big,
              cover_xl: item.album.cover_xl
            },
            inLibrary: false
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

// transform Artist response to match DB schema
async function getArtistsFromTransformedData(array){
  array.forEach(item => {
    const isFound = transformedArtistResponse.find(artist => artist._id === item.artist.id)
    if(isFound){
      return
    }
    else{
      transformedArtistResponse.push(new Artist({
        _id: item.artist.id,
        name: item.artist.name,
        artist_art:{
          cover: item.artist.picture,
          cover_medium: item.artist.picture_medium,
          cover_large: item.artist.picture_big,
          cover_xl: item.album.cover_xl
        }
      }))
    }

    
  })
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
    const axios = require('axios');
    const url= 'https://deezerdevs-deezer.p.rapidapi.com/search?q'
    const options = {
      method: 'get',
      params: {q: query},
      headers: {
        'x-rapidapi-key': process.env.RAPID_API_KEY,
        'x-rapidapi-host': process.env.RAPID_API_HOST
      }
    }
    try{
      const response = await axios.get(url, options)
      transformedApiResponse =  transformApiResult(response.data)
      apiSearchQueryResponse = [...response.data.data]
      getArtistsFromTransformedData(response.data.data)
      return transformedApiResponse;
      //console.log(transformedApiResponse[1]) //4
    }
   //console.log(response.data.data[0])
   catch(error)  {
      console.error(new Error(`${error.message}`))
    }
    //
  }
// #endregion

// #region User
  // save album to user library
  async function saveToUserAlbumLibrary(userID, albumID,songID){
    try{
      albumExist = await Album.findOne({_id:albumID})

      if(albumExist){
        await User.updateOne(
          {user_id:userID, 'library.album.id': albumID},
          {$addToSet:{'library.album.song_ids': songID} },
          {upsert: true}
        ).then()
        .then()
      }
      else{
        await User.updateOne(
          {user_id:userID},
          {$set: {'library.album.id': albumID, 'library.album.song_ids': songID } },
          {upsert: true}
        ).then()
      }
    }
    catch(error){
      console.log(`Error: ${error}`)
    }


  }

  // save single to user library
  async function saveToUserSingleLibrary(userID, trackID){
      await User.updateOne(
        {user_id:userID},
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
      {user_id:userID},
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

async function saveSingleSongToDB(song){
  const isFound = await Song.findOne(
    {_id:song._id}
  )
  if(isFound){
    console.log('Song already exists')
  }
  else{
    song.save()
    .then()
    .then()
    .catch(error =>{
      console.log(`Error: ${error}`)
    })
  }
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
  async function saveToAlbumInDB(album){
    const isFound = await Album.findOne(
      {_id:album._id}
    )
    if (isFound){
      await Album.updateOne(
        {_id:album._id}, 
        {$addToSet: {song_ids:album.song_ids[0]}},
        {$upsert: true}
  
      ).then()
      .catch(error => {
        console.log(`Error: ${error}`)
      });
    }
    else{
      await album.save()
      .then()
      .catch(error => {
        console.log(`Error: ${error}`)
      });
    }
    

  }

 // async function saveToArtistInDB()

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
    addToLibrary,
    saveToUserAlbumLibrary,
    saveToUserSingleLibrary,
    saveToUserArtistLibrary,
    saveSingleSongToDB,
    saveToAlbumInDB,
    saveNewAlbumToDB,
    saveArtistToDB
}