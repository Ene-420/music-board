const { Router } = require("express");
//const { user } = require("pg/lib/defaults");
const musicRouter = Router();


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
});
module.exports = musicRouter;