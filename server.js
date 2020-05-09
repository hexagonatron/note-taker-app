const express = require("express");
const path = require("path");

const Notelist = require("./lib/Notelist");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static("public"));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const DB_DIR = path.join(process.cwd(), "db/db.json");

const notes = new Notelist(DB_DIR);


app.listen(PORT, (err) => {
    if(err) return console.log(err);

    console.log(`Listening on ${PORT}`)
});

app.get("/notes", (req, res) => {

    res.sendFile(path.join(process.cwd(), "public/notes.html"));
});

app.get("/api/notes", async (req, res) => {
    try {    
        res.json(notes.getNonDeletedNotes());
    } catch (err) {
        res.json({ error: err })
    }
});

app.post("/api/notes", async ({ body: { title, text } }, res) => {
    try {
        if (!title) throw "Empty title";
        if (!text) throw "Empty text";

        const newNote = await notes.createNote(title, text);

        res.json(newNote);

    } catch (err) {
        res.json({ error: err });
    }
});

app.delete("/api/notes/:id", async ({params: {id}}, res) => {
    try{
        const message = await notes.deleteNote(id);
        res.json(message);
    } catch(err){
        res.json({error: err});
    }
});