const express = require("express");
const app = express();
const musicRouter = require('./routes/MusicRouter');



app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("library/", musicRouter);




