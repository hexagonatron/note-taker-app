const express = require("express");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static("public"));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const DB_DIR = path.join(process.cwd(), "db/db.json");

const loadData = () => {
    return new Promise((res, rej) => {
        try{
            fs.readFile(DB_DIR, "utf-8", (err, data) => {
                if(err) throw err;
    
                res(JSON.parse(data));
    
            })
        } catch(err) {
            rej(err)
        }
    })
}

const saveData = (data) => {
    return new Promise((res, rej) => {
        try{

            const dataString = JSON.stringify(data);

            fs.writeFile(DB_DIR, dataString, "utf-8", (err) => {
                if(err) throw err;
                res();
            })
        } catch(err){
            rej(err)
        }
    })
}

const deleteNote = async (id) => {
    return new Promise((res, rej) => {
        const savedData = await loadData();
    
        newData = savedData.filter((note) => {
            note.id != id
        });

    })



}

app.listen(PORT, (err) => {
    if(err) return console.log(err);

    console.log(`Listening on ${PORT}`)
});

app.get("/notes", (req, res) => {

    res.sendFile(path.join(process.cwd(), "public/notes.html"));
});

app.get("/api/notes", async (req, res) => {
    try {

        const notes = await loadData()
            
        res.json(notes);
    
    } catch (err) {
        res.json({ error: err })
    }
});

app.post("/api/notes", async ({body: {title, text}}, res) => {
    try {
        if (!title) throw "Empty title";
        if (!text) throw "Empty text";

        loadedData = await loadData();

        console.log(loadedData);

        newNote = {
            title: title,
            text: text,
            id: loadedData.length+1,
            deleted: false
        };

        newData = [...loadedData, newNote];
        console.log(newData);

        saveData(newData)
        
        res.json({
            title: newNote.title,
            text: newNote.text,
            id: newNote.id
        });
    } catch (err) {
        res.json({ error: err });
    }
});

app.delete("/api/notes/:id", ({params: {id}}, res) => {
    console.log(id);
    const deletedNote = deleteNote(id);
    res.json(deletedNote);
})