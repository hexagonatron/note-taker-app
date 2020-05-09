const express = require("express");
const fs = require("fs");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.listen(PORT, (err) => {
    if(err) return console.log(err);

    console.log(`Listening on ${PORT}`)
});

