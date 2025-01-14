const { Router } = require("express");
//const { user } = require("pg/lib/defaults");
const musicRouter = Router();


musicRouter.get("/", (req, res) => {
  res.render("index");
});

module.exports = musicRouter;