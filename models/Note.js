//Link to mongoose and create example schema for user notes in the database rutabagaDB
let mongoose = require("mongoose");

let Schema = mongoose.Schema;
let NoteSchema = new Schema(
    {
        body: {
            type: String
        }
    });

//model method creates the model from example schema then export with module.exports
let Note = mongoose.model("Note", NoteSchema);

module.exports = Note;