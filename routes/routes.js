module.exports = function(app) {

//Index page - primary route
app.get("/", function(req, res) {
    res.send("Hello World");

});
};