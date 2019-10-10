var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middleware = {};

middleware.checkCampgroundOwnership = function(req, res, next) {
    // IS UER LOGGED IN?
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundComment) {
            if (err) {
                req.flash("error", "Campground not found!");
                res.redirect("back");
            }
            else {
                // DOES USER OWN THE CAMPGROUND?  
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("error", "You do not have permission to do that!");
                    res.redirect("back");
                };

            }
        });
    }
    else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    };
};

middleware.checkCommentOwnership = function(req, res, next) {
    // IS UER LOGGED IN?
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                res.redirect("back");
            }
            else {
                // DOES USER OWN THE COMMENT?  
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("error", "You do not have permission to do that!");
                    res.redirect("back");
                };
            }
        });
    }
    else {
        req.flash("error", "You need to be logged  in first!");
        res.redirect("back");
    };
};

middleware.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    };
    req.flash("error", "You need to login to do that!");
    res.redirect("/login");
};


module.exports = middleware;
