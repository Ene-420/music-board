require('dotenv').config();
const express = require("express");
const app = express();
const musicRouter = require('./routes/MusicRoutes');
const mongoose = require('mongoose');
const { Client } = require("pg");
const path = require('path');
// const pwd = process.env.DB_PWD;
// const dbUser = process.env.DB_USER;
const PORT =  process.env.PORT|| 3000;
const client =  new Client({
    connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PWD}@localhost:5432/${process.env.DB}`,
});

// mongoose.connect(dbURL, {useNewUrlParser:true, useUnifiedTopology:true})
// .then((result) => app.listen(PORT))
// .catch(((err) => console.log(err) ));



client.connect()
.then((result) => app.listen(PORT))
.catch((error) => console.error(error))


app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(musicRouter);

app.get('/', (req, res)=>{
    res.redirect('/library')
})


