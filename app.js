var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

// 27017 is the port that our mongo demon or mongod is running on 
mongoose.connect("mongodb://localhost:27017/yelp_camp", {
    useNewUrlParser: true
});
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");

// schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//         name: "Wow",
//         image: "https://static01.nyt.com/images/2018/01/02/science/02SCI-MIND/merlin_131683850_13f8c9fe-affa-48bf-ab41-66ed93c2394a-articleLarge.jpg?quality=75&auto=webp&disable=upscale",
//         description: "This fake word generator will generate all kinds of words, some put words together, others are totally new! You can also keep a short list of fake words that you like by clicking on that word in the list under the generator named 'fake words generated'. If you have a fake word you would like to add to the fake word generator contact us and we will add it to the list."
//     },
//     function (err, campground) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("NEWLY CREATED CAMPGROUND: ");
//             console.log(campground);
//         }
//     });

// var campgrounds = [{
//         name: "1",
//         image: "https://static01.nyt.com/images/2018/01/02/science/02SCI-MIND/merlin_131683850_13f8c9fe-affa-48bf-ab41-66ed93c2394a-articleLarge.jpg?quality=75&auto=webp&disable=upscale"
//     },
//     {
//         name: "2",
//         image: "https://static01.nyt.com/images/2018/01/02/science/02SCI-MIND/merlin_131683850_13f8c9fe-affa-48bf-ab41-66ed93c2394a-articleLarge.jpg?quality=75&auto=webp&disable=upscale"
//     },
//     {
//         name: "3",
//         image: "https://static01.nyt.com/images/2018/01/02/science/02SCI-MIND/merlin_131683850_13f8c9fe-affa-48bf-ab41-66ed93c2394a-articleLarge.jpg?quality=75&auto=webp&disable=upscale"
//     },
//     {
//         name: "4",
//         image: "https://i1.wp.com/thepointsguy.com/wp-content/uploads/2017/07/GettyImages-652743099.jpg?fit=2000%2C1328px&ssl=1"
//     },
//     {
//         name: "5",
//         image: "https://static01.nyt.com/images/2018/01/02/science/02SCI-MIND/merlin_131683850_13f8c9fe-affa-48bf-ab41-66ed93c2394a-articleLarge.jpg?quality=75&auto=webp&disable=upscale"
//     },
//     {
//         name: "6",
//         image: "https://i.dailymail.co.uk/i/pix/2014/08/20/article-2729488-20A6089100000578-282_634x627.jpg"
//     },
// ];

app.get("/", function (req, res) {
    res.render("landing");
});

// index route: show all campgrounds
app.get("/campgrounds", function (req, res) {
    // get all campgrounds from DB
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {
                campgrounds: allCampgrounds
            });
        }
    });

});

// create route: add new campground to DB
app.post("/campgrounds", function (req, res) {

    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {
        name: name,
        image: image,
        description: description
    };
    // create a new campground and save to DB
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            // redirect back to campgrounds page  
            res.redirect("/campgrounds");
        }
    });
});

// new route: show form to create new campground
app.get("/campgrounds/new", function (req, res) {
    res.render("new");
});

// the order matters!
// SHOW route: show more info about one campground
app.get("/campgrounds/:id", function (req, res) {
    // find the campground with provided ID 
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            // render show template with that campground
            res.render("show", {campground: foundCampground});
        }
    });

});

app.listen("3000", "127.0.0.1", function () {
    console.log("The YelpCamp Server has started!");
});