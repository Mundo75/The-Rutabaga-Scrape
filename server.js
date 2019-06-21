//Require dependencies 
const express = require("express");
const mongoose = require("mongoose");
const bodyParser =require("body-parser");

//Set up express App and dynamic port for heroku and local host server start
const app = express();
const PORT = process.env.PORT || 7572;

//Set up express app to handle data parsing and static css js files
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json());

//link this file to routes file
require("./routes/routes")(app);

//Start the server to begin listening
app.listen(PORT, function() {
    console.log("Congratulations, Your App is Listening on PORT " + PORT);

});

