//Controller for backend 

// DB Schema 
const User = require('../model/user.js');
const Artist = require('../model/artist.js');
const Album = require('../model/album.js');
const Song = require('../model/song.js');

const apiSearchQueryResponse = [];    ///Save Api search result

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

  // Frontend sends query request to the backend and backend checks the DB
  // then if exists return finding
  // else make api request

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
      return  result;
    } catch (error) {
      console.error(error);
    }
  }

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

    const user = new User();
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

  /// Save to album in DB
  async function saveToAlbumInDB(albumId,songId){
    await Album.updateOne(
      {albumId}, 
      {
        $set: {song_ids:[].push(songId)}
      },
      {$upsert: true}

    ).then()
    .catch(error => {
      console.log(`Error: ${error}`)
    });

  }

  // Save artist to DB 
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

  //Apply async to API requests, Form handling, and Database requests

