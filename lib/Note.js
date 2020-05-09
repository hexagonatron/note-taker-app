class Note {
    constructor(title, text, id){
        this.title = title;
        this.text = text;
        this.deleted = false;
        this.id = id;
    }
}

module.exports = Note;