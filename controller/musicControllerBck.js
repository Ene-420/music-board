//Controller for backend 
import { Track, TrackCover } from '../model/track.js';
import axios from 'axios';
import {insertIntoSongTable, addToUserLibrary} from './dbController.js'

//const pool = require('./pool.js');
//const fetch = require('node-fetch');
//const axios = require('axios');
// DB Schema 
//const User = require('../model/user.js');
//const Artist = require('../model/artist.js');
//const Album = require('../model/album.js');
//const Song = require('../model/song.js');
//const Track = require('../model/track.js')
//const {insertIntoSongTable, insertIntoTrackCover, addToUserLibrary} = require('./dbController.js');

let apiSearchQueryResponse = [];    ///Save Api search result
let transformedApiResponse = [];      ///Save transformed API response


export async function callBackend(item){
  const {query, source} = item;

  try{
    if (source.includes('library')){
      //return await queryResult(query)
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
        if(item.album.title.includes(item.title)){
          return new Track(item.id, item.title, item.id, item.title, item.artist.id, item.artist.name, item.duration)
        }
        else{
          return new Track(item.album.id, item.album.title, item.id, item.title, item.artist.id, item.artist.name, item.duration)
        }
        
      })
  
    //return transformedApiResponse
    }
  }catch(error){
    return new Error('Error transforming data')
  }

}

export async function addToLibrary(songID){
  const track = transformedApiResponse.find(item => item.songID === parseInt(songID));

  if (track){

    await insertIntoSongTable(track)
    await addToUserLibrary(new User().userID, track.songID, track.albumID, 'test')
  }




}
// #region DB
// Query database for entries matching query
// async function queryResult(query){
//     try {

//   }
// }
  // #endregion

// #region API
  //uses search bar query to make API request
  async function makeApiCall(query){
   
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
      
      return transformedApiResponse;

    } catch (error) {
      console.error(error);
    }
  }
// #endregion

// #region User
  // save album to user library
  async function saveToUserAlbumLibrary(userID, albumID){
    
  }

  // save single to user library
  async function saveToUserSingleLibrary(userID, trackID){

  }
  //save artist to user library
  async function saveToUserArtistLibrary(userID, artistID){

  }

async function saveSingleSongToDB(index){

 
}
  
  async function saveToAlbumInDB(albumId,songId){

  }

  /// Add New album/single to Library
  async function saveNewAlbumToDB(index){
  }

  async function saveArtistToDB(index){

  }


