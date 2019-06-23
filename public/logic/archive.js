$(document).ready(function() {
    
    //function renders divs to display data in the archive page html
    function displayStories() {
        archiveStoryDiv.empty();
        $.get("/api/stories?saved=true").then(function(data) {
            if(data.stories.length) {
                let storyPanels = [];

                data.stories.forEach(function(story) {
                    storyPanels.push(displayPanel(story));
                });
                archiveStoryDiv.append(storyPanels);

            } else {
                let emptyAlert = $("<h3>");
                emptyAlert.addClass("text-center");
                emptyAlert.text("Nothing to See Here! Please Disperse!");
                archiveStoryDiv.append(emptyAlert);
            };
        });
    };

    //function renders divs to display data in archive html
    function displayPanel(story) {
        let panel = $(
            [
                `<div class="panel panel-dark" data-id=${story.id}">`,
                `<div class="panel-heading">`,
                `<h3 class="panel-title">${story.headline}</h3>`,
                `<div/>`,
                `<div class="panel-body">${story.summary}<div/>`,
                `<div class="panel-footer clearfix">`,
                `<a class="btn btn-danger pull-right deleteStory" id="panelButton1">Trash Stories<a/>`,
                `<a class="btn btn-default pull-right readNotes" id="panelButton2">Reader Comments</a>`,
                `</div>`,
                `</div>`
            ].join("")
        );
        return panel;
    };
    //Event handling function with ajax call for deleting stories from the archive
    let trashStory = $(this).parent().parent().data();

    $.ajax({
        method: "DELETE",
        url: "/api/delete" + trashStory.id
    }).then(function(data) {
        if(data.success)
        displayStories();
    });

    //Event handling function for viewing reader notes
    function viewNotes() {
        let story = $(this).parent().parent().data();
        $.get("/api/notes/" + story.id).then(function(data) {
            let noteResults = {
                storyID: story.id,
                notes: data.notes || []
            }
            $("#archiveNote").data("story", noteResults);

            displayStoryNotes(noteResults);

            $("#notesModal").modal({
                backdrop: "static",
                keyboard: false
            });
            $("#notesModal").modal("show");
        });

    };

    function displayStoryNotes(noteResults) {
        storyNotes.empty();
        $("#storyId").text(noteResults.storyID);

        if(noteResults.notes.length > 0) {
            let noteArray = [];
            noteResults.notes.forEach(function(note) {
                noteArray.push(displayStroyNoteItem(note));
                
            });
            storyNotes.append(noteArray);

        } else {
            let noteArray = $("<li>");
            noteArray.addClass("list-group-item");
            noteArray.text("No Notes Right Now, Come Back Later!");
            storyNotes.append(noteArray);
        };
    };

    //Event handling function for saving reader notes
    function keepNote (){
        let noteText = $("#noteText").val().trim();
        let noteData = {
            id: $(this).data("story").storyID,
            noteBody: noteText
        };

        $.post("/api/notes", noteData).then(function() {
            $("#noteText").val("");
            $("#notesModal").modal("hide");
        });
    };

    //Event handling function for deleting reader notes
    function trashNote() {
        let deleteNote = $(this).data("id");
        
        $.ajax({
            url: "/api/notes/" + deleteNote,
            method: "DELETE" 
        }).then(function() {
            $("#notesModal").modal("hide");
        });
    };

    function displayStroyNoteItem(note) {
        let readerNoteArray = $(
            [
                `<li class=list-group-item clearfix">`,
                `<a class="btn btn-danger pull-right delete-note" data-id="{note._id}"&times;</a>`,
                `${note.body}`,
                `</li>`
            ].join("")
        );
        return readerNoteArray;
    };
    
    let archiveStoryDiv = $("#archiveStoryDiv");
    let storyNotes = $("#storyNotes");
    $(document).on("click", ".deleteStory", trashStory);
    $(document).on("click", ".readNotes", viewNotes);
    $(document).on("click", "#archiveNote", keepNote);
    $(document).on("click", ".deleteNote", trashNote);
});