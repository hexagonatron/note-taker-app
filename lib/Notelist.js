const fs = require("fs");
const Note = require("./Note");

class Notelist {
    constructor(dbPath){
        this.dbPath = dbPath;
        this.notes = [];
        this.totalNotes = 0;
        this.numDeletedNotes = 0;
        this.numNotDeletedNotes = 0;
        this.loadFromFile();
    }

    loadFromFile() {
        try {
            fs.readFile(this.dbPath, "utf-8", (err, data) => {
                if (err) throw err;

                this.notes = [...JSON.parse(data)];
                this.countNotes();
            })
        } catch (err) {
            console.log(err)
        }
    }

    saveToFile() {
        return new Promise((res, rej) => {
            try {
    
                const notesString = JSON.stringify(this.notes);
    
                fs.writeFile(this.dbPath, notesString, "utf-8", (err) => {
                    if (err) throw err;
                    res();
                });
            } catch (err) {
                rej(err);
            }
        })
    }

    countNotes() {
        this.totalNotes = this.notes.length;
        this.numDeletedNotes = this.notes.reduce((acc, note) => note.deleted? acc: acc + 1,0);
        this.numNotDeletedNotes = this.notes.reduce((acc, note) => note.deleted? acc + 1: acc,0);
    }

    createNote(title, text){
        return new Promise(async (res, rej) => {
            try{
                const newNote = new Note(title, text, this.totalNotes + 1);
        
                this.notes.push(newNote);
        
                await this.saveToFile();
        
                this.countNotes();

                res(newNote);

            } catch(err){
                rej(err);
            }
        });
    }

    deleteNote(id){
        return new Promise(async (res, rej) => {
            try{
            
                this.notes.forEach((note) => {
                    if(note.id == id){
                        note.deleted = true;
                    };
                });

                await this.saveToFile();

                this.countNotes();
    
                res("Success");
    
            } catch(err){
                rej(err)
            }
        });
    }

    getNonDeletedNotes(){
        return this.notes.filter(note => !note.deleted);
    }
}

module.exports = Notelist;