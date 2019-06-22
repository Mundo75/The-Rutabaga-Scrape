//Link to mongoose and create example schema for Story data in the database rutabagaDB
const mongoose = require("mongoose");

let Schema = mongoose.Schema;
let StorySchema = new Schema (
    {
        headline: {
            type: String,
            unique: true
        },
        summary: {
            type: String,
        },
        url: {
            type: String
        },
        archived: {
            type: Boolean
        },
        notes: [
            {
                type: Schema.Types.ObjecteId,
                ref: "Note"
            }
        ]
    });

//model method creates the model from example schema then export with module.exports
let Story = mongoose.model("Story", StorySchema);

module.exports = Story;
