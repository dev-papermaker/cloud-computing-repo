var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/", function (req, res) {
    // Get all campgrounds from DB
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds });
        }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function (req, res) {
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var desc = req.body.description;
    var author = { id: req.user._id, username: req.user.username };
    var newCampground = { name: name, description: desc, author: author };
    // Create a new campground and save to DB
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        }
        else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id", function (req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        }
        else {
            //render show template with that campground
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });

});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", { campground: foundCampground });
    });
});

// UPDATE CAMPGROUND ROUTE
// IT'S A PUT REQUEST
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    // FIND AND UPDATE THE CAMPGROUND
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err, campgroundRemoved) {
        if (err) {
            // res.redirect("/campgrounds/" + req.params.id);
            res.redirect("/campgrounds");
        }
        else {
            // NEED TO DELETE THE RELATED COMMENTS WHEN DELETING THE CAMPGROUND
            // Comment.deleteMany({ _id: { $in: campgroundRemoved.comments } }, function(err) {
            //     if (err) {
            //         res.redirect("/campgrounds");
            //     }
            //     else {
            //         res.redirect("/campgrounds");
            //     }
            // });
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;
