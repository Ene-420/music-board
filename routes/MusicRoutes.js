const { Router } = require("express");
const express = require('express');
//const app = express();
const Artist = require("../model/artist");
const Song = require("../model/song");
const Album = require("../model/album");
const User = require("../model/user");
//const { user } = require("pg/lib/defaults");
const {getSongID, testButton, } = require('../controller/musicControllerUI.js');
const musicRouter = Router();

const searchResult = [];
console.log('I got here')
const data = {
  title: 'Library',
  library: [],
  testButton: testButton
}
musicRouter.use(express.urlencoded({ extended: true }));

musicRouter.get("/library", (req, res) => {
  console.log('I got to library')
  
  res.render("library",  data);
});

musicRouter.get("/artist", (req, res) => {
  res.render("artists", { artists: [] }); 
});

musicRouter.get("/album", (req, res) => {
  res.render("album", {album: []});
});

musicRouter.post("/search", async (req, res) => {
  //res.render("song");
  const item = req.body.query;
  
  console.log({item});
  res.render("search", {search: []});
});

musicRouter.get("/search", async (req, res) => {
  
})
musicRouter.post('/save-song', async(req, res) =>{
  
})


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



async function apiSearchResult(query){
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
    return  result;
  } catch (error) {
    console.error(error);
  }
}


function AddToLibrary(event){
  const {dataset} = event.target;
  //User
}

module.exports = musicRouter;