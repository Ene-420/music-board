const { Router } = require("express");
const express = require('express');
//const app = express();
const Artist = require("../model/artist");
const Song = require("../model/song");
const Album = require("../model/album");
const User = require("../model/user");
//const { user } = require("pg/lib/defaults");
const {getSongID, testButton, } = require('../controller/musicControllerUI.js');
const {callBackend, addToLibrary} = require('../controller/musicControllerBck.js');
const musicRouter = Router();

//const searchResult = [];
//console.log('I got here')

musicRouter.use(express.urlencoded({ extended: true }));

musicRouter.get("/library", (req, res) => {
  console.log('I got to library')
  const data = {
    title: 'Library',
    library: []||[],
    //getSongID: getSongID
  }
  res.render("library",  data);
});

musicRouter.get("/artist", (req, res) => {
  res.render("artists", { artists: [] }); 
});

musicRouter.get("/album", (req, res) => {
  res.render("album", {album: []});
});

musicRouter.post("/search", async(req, res) => {
  const response =  await callBackend(req.body);
  //console.log(req.body) //2
  const data = {
    title: 'Search',
    search: response,
    getSongID: getSongID
  }
  res.render('search', data);
  
});

musicRouter.get("/search", async (req, res) =>{
  
})
musicRouter.post('/save-song', async(req, res) =>{
  
  try{
    console.log(req.body)
    var item_id, songID, response;
    const type = req.body.item_type
    console.log('SONG ID:', item_id)
    const userID = '67f1895e6f5434b70298502fb'; //req.session.userID;
    if(type.includes('song')){
      const item_id = req.body.item_id;
      response = await addToLibrary(item_id);
    }else{
      item_id = req.body.item_id;
      songID = req.body.item_songID;
      response = addToLibrary(item_id)
    }
    const data = {
      title: 'Search',
      search: response,
    }
    res.render('search', data)
  }catch(error){  
    console.log(error)
  }
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

/*
on test branch to merge with main -->
git pull origin test
git checkout main
git merge test
git push origin main

on main branch to merge with test -->
git pull origin main
git checkout test
git merge main
git push origin test
 */


module.exports = musicRouter;