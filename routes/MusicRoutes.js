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

  }

});


async function queryResult(query){
  try {
    const [albumResult, songResult, artistResult] =  await Promise.all([
      Album.find({title: `${query}`}),
      Song.find({title:`${query}`}),
      Artist.find({title: `${query}`}),
    ]);
    return [...albumResult, ...songResult, ...artistResult ]

  } catch (error) {
    console.log(error)
  }
}
module.exports = musicRouter;


async function apiSearchResult(query){
  const fetch = require('node-fetch');

const url = 'https://deezerdevs-deezer.p.rapidapi.com/search?q=eminem';
const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': 'fd1b4565a3msh304df7d6e8195dep125480jsne20d6800ea89',
    'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
  }
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}
}