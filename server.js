var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");
var request = require("request");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;



// Initialize Express
var app = express();
// Configure middleware
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Set Handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// If deployed, use the deployed database. Otherwise use the local newsapp database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsapp";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);



app.get("/", (req, res) => {
    res.render("index")
});

app.get("/saved", (req, res) => {
    res.render("saved")
});


    app.get("/scrape", (req, res) => {
        request("https://www.vox.com/", (error, res, html) => {
            var $ = cheerio.load(html);
            var result = {};
            
            $("h2").each(function (i, element) {
    
                result.title = $(this).children("a").text();
                result.summary = $(this).children("p").text();
                result.link = $(this).children("a").attr("href");
                
                db.Article.create(result)
                    .then(function (dbArticle) {
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        return res.json(err);
                    });
            });
            console.log(result);
        });
        res.send("Scrape Complete")
    });



app.get("/articles", (req, res) => {
    db.Article.find({})
        .then((dbArticle) => {
            res.json(dbArticle)
        })
        .catch((err) => {
            res.json(err)
        });
});

app.get("/articles/:id", (req, res) => {
    db.Article.findOne({ _id: req.params.id })
        .populate("notes")
        .then((dbArticle) => {
            res.json(dbArticle)
        })
        .catch((err) => {
            res.json(err)
        });
});

app.post("/articles/:id", (req, res) => {
    db.Notes.create(req.body)
        .then((dbNote) => {
            return db.Article.findOneAndUpdate({ _id: req.params.id}, { notes: dbNotes._id}, { new: true});
        })
        .then((dbArticle) => {
            res.json(dbArticle)
        })
        .catch((err) => {
            res.json(err)
        });
});



// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});