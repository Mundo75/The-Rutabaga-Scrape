$(document).ready(function() {

      //Function with get call for modal event when the get stories button is clicked (start scrape)
      function getScrapeStories() {

        let scrapeButton = $(this).button("loading");
        $.get("/api/scrape").then(function(data) {
            if(data.alert) {
                $("#alertPopUp").text(data.alert);
                $("#popUpModal").modal({
                    backdrop: "static",
                    keyboard: false
                });
                $("#popUpModal").modal("show");
                if(data.number && data.number > 0) {
                    displayStories();
                }
            }
            scrapeButton.button("reset");
        });
    };

        //Function with get call to render stories from web scrape to index html
        function displayStories() {
            storyDiv.empty();
    
            $.get("/api/stories?saved=false").then(function(data) {
                if(data.stories.length) {
                    let storyPanels = [];
    
                    data.stories.foreach(function(story) {
                        storyPanels.push(displayPanel(story));
                    });
                    storyDiv.append(storyPanels);
    
                } else {
                    let emptyAlert = $("<h3>");
                    emptyAlert.addClass("text-center");
                    emptyAlert.text("Nothing to See Here! Please Disperse!");
                    storyDiv.append(emptyAlert);
                }
            });
        };
    
    //Function render divs to display data in the html
    function displayPanel(story) {
        let panel = $(
            [
                `<div class="panel panel-dark" data-id="${story._id}">`,
                `<div class="panel-heading">`,
                `<h3 class=panel-title">${story.headline}</h3>`,
                `</div>`,
                `<div class="panel-body">${story.summary}</div>`,
                `<div class="panel-footer clearfix">`,
                `<a class="btn btn-success pull-right archiveStory" id="panelButton1">Keep It!</a>`,
                `<a href="https://www.newyorker.com$" + "{story.url}" target="_blank" class="btn button-default pull-right" id="panelButton2>Read It!</a>`,
                `</div>`,
                `</div>`
            ].join("")
        );
        return panel;
    }

    //Event handling function with ajax call for saving stories to the archive
    function archiveScrapeStories() {
        let archiveEvent = $(this).parent().parent().data();
        archiveEvent.archived = true;

        $.ajax({
            method: "PUT",
            url: "/api/archived",
            data: archiveEvent
        }).then(function(data) {
            if(data.success)
                displayStories();
        });
    };
    
    let storyDiv = $("#storyDiv");
    $(document).on("click", "#getStories", getScrapeStories);
    $(document).on("click", ".archiveStory", archiveScrapeStories);
});

