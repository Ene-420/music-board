require('dotenv').config();
const express = require("express");
const app = express();
const musicRouter = require('./routes/MusicRoutes');
const mongoose = require('mongoose');
const pwd = process.env.DB_PWD;
const dbUser = process.env.DB_USER;
const PORT =  process.env.PORT|| 3000;
const dbURL = `mongodb+srv://${dbUser}:${pwd}@nodeclust.10gws.mongodb.net/Music_Board?retryWrites=true&w=majority&appName=nodeCLUST`;

mongoose.connect(dbURL, {useNewUrlParser:true, useUnifiedTopology:true})
.then((result) => app.listen(PORT))
.catch(((err) => console.log(err) ));

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(musicRouter);

app.get('/', (req, res)=>{
    res.redirect('/library')
})


