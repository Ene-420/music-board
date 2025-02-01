const express = require("express");
const app = express();
const mongoose = require("mongoose");
const musicRouter = require('./routes/MusicRoutes');
const PORT = 3000;
const dbURL =
    "mongodb+srv://Ene_420_VM:<db_password>@nodeclust.10gws.mongodb.net/?retryWrites=true&w=majority&appName=nodeCLUST";
const passwd = "POp20";
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.redirect("/library");
});
app.use(musicRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



