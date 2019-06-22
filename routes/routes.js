const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function(app) {

    //Index page - primary path - html route
    app.get("/", function(req, res) {
        db.Story.find({
            archived: false
        }).then(function(dbStories) {
            res.render("index", {
                data: dbStories,
                currentPage: { index: true }
            });
        }).catch(function(error) {
            res.render("index", {
                data: error,
                currentPage: { index: true }
            });
        });

    });
};

    //Archive page - path html route
    app.get("/archived", function(req, res) {
        db.Story.find({
            archived: true
        }).then(function(archivedStories) {
            res.render("archived stories", {
                data: archivedStories,
                currentPage: { saved: true }
            });
        }).catch(function(error) {
            res.render("archived stories", {
                data: error,
                currentPage: { saved: true}
            });
        });
    });

    //Web Scrape Axios call - Api route
    app.get("/api/scrape", function(req, res) {
        db.Story.find({}).then(function(dbStories) {

            let archivedStories = dbStories.map(function(story) {
                story.headline;
            })

            axios.get("https://www.newyorker.com/humor/borowitz-report/").then(function(response) {

                const $ = cheerio.load(response.data);
                let storieArray = [];

                $("li.River__riverItem___3huWr").each(function(i, element) {
                    let newStory ={};

                    newStory.headline = $(element)
                        .children("div.River__riverItemContent___2hXMG")
                        .children("a.Link__link___3dWao ")
                        .children("h5.River__dek___CayIg")
                        .text();

                    newStory.url = $(element)
                        .children("div.River__riverItemContent___2hXMG")
                        .children("a.Link__link___3dWao ")
                        .attr("href");

                    newStory.summary = $(element)
                        .children("div.River__riverItemContent___2hXMG")
                        .children("div.River__riverItemBody___347sz")
                        .children("h5.River__dek___CayIg")
                        .text();

                    newStory.archived = false;

                    if (!archivedStories.includes(newStory.headline)) {
                        storieArray.push(newStory);
                    }

                });

                db.Story.insertMany(storieArray).then(function(data) {
                    res.status(200).send({
                        "alert": "${data.length} new stories have been added",
                        "number": data.length
                    });
                }).catch(function(error) {
                    res.status(200).send({
                        "alert": "${error.alert}"
                    });
                });

            });  
        }).catch(function(error) {
            res.status(200).send({
                "alert": "An error occurred scaping stories"
            });
        });
    });
    
    //Amending stories to archive - API route
    app.put("/api/archived", function(req, res) {
        db.Story.update({
            _id: req.body.id
        },
        {
            archived: req.body.archived
        }).then(function(data) {
            res.status(200).send({
                success: true
            });
        }).catch(function(error) {
            res.status(200).send({
                success: false
            });
        });
    });

    //Deleting stories from archive page - API route
    app.delete("/api/delete/:id", function(req, res) {
        db.Story.update({
            _id: req.params.id
        },
        {
            archived: false
        }).then(function(data) {
            res.status(200).send({ 
                success: true
            });
        }).catch(function(error) {
            res.status(200).send({
                success: false
            });
        });
    });

    //Get stories to display -- API route
    app.get("/api/stories", function(req,res) {
        
        let archivedData = false;
        
        if(req.query.archived) {
            if(req.query.archived == "true")
                archivedData = true

        }

        db.Story.find({
            archived: archivedData
        }).then(function(data) {
            res.status(200).send({
                stories: data 
            });
        }).catch(function(error) {
            res.status(200).send({
                error: error 
            });
        });
    });

    //Handling reader notes - API route
    app.post("/api/notes", function(req, res) {
        db.Note.create({
            body: req.body.noteBody
        }).then(function(dbNote) {
            db.Story.findOneAndUpdate({
                _id: req.body.id 
            },
            {
                $push: { notes: dbNote._id }
            }).then(function(data) {
                res.status(200).send({
                    success: true 
                });
            });
        }).catch(function(error) {
            res.status(200).send({
                error: error 
            });
        });
    });

    //Deleting reader notes - API route
    app.delete("/app/notes/:id", function(req, res) {
        db.Note.findOneAndRemove({
            _id: req.params.id 
        }).then(function(data) {
            db.Story.findOneAndUpdate({
                notes: { $in: [req.params.id] }
            },
            {
                $pull: { notes: req.params.id }
            }).then(function(data) {
                res.status(200).send({
                    success: true 
                });
            }).catch(function(error) {
                res.status(200).send({
                    error: error 
                });
            });
        });
    });