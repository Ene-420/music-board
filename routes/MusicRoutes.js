const { Router } = require("express");
const express = require('express');
//const app = express();
const Artist = require("../model/artist");
const Song = require("../model/song");
const Album = require("../model/album");
const User = require("../model/user");
//const { user } = require("pg/lib/defaults");
const {getSongID, testButton, } = require('../controller/musicControllerUI.js');
const {callBackend} = require('../controller/musicControllerBck.js');
const musicRouter = Router();

//const searchResult = [];
//console.log('I got here')

musicRouter.use(express.urlencoded({ extended: true }));

musicRouter.get("/library", (req, res) => {
  console.log('I got to library')
  const data = {
    title: 'Library',
    library: [],
    testButton: testButton
  }
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
  const query = req.body;
  
  
});

musicRouter.get("/search", async (req, res) =>{
  
})
musicRouter.post('/save-song', async(req, res) =>{
  const response = await callBackend(req.body);
  const data = {}
  res.render('search', data);
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




module.exports = musicRouter;