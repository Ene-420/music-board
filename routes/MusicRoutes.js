const { Router } = require("express");
const Artist = require("../model/artist");
const Song = require("../model/song");
const Album = require("../model/album");
//const { user } = require("pg/lib/defaults");
const musicRouter = Router();

app.use(express.urlencoded({ extended: true }));

musicRouter.get("/library", (req, res) => {
  res.render("library", {library: []});
});

musicRouter.get("/artist", (req, res) => {
  res.render("artists", { artists: [] }); 
});

musicRouter.get("/album", (req, res) => {
  res.render("album", {album: []});
});

musicRouter.get("/search", (req, res) => {
  //res.render("song");
  const item = req.body.query;
  
  const result = queryResult(item);

  if (result){
    res.render('search',{search: result} );
  }
  else{
    const response  = apiSearchResult(item);
    res.render('search', {search: response})
  }

});


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
module.exports = musicRouter;


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