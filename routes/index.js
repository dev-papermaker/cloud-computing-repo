var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Memo = require("../models/memo");

router.get("/", function (req, res) {
    res.render("landing");
});


// =====================
// AUTH ROUTES
// =====================

// REGISTER ROUTE
// REGISTER FORM
router.get("/register", function (req, res) {
    res.render("register");
});

// HANDLE REGISTER LOGIC
router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username, email: req.body.email, avatar: req.body.avatar, company: req.body.company, industry: req.body.industry });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to Memos, " + user.username);
            res.redirect("/memos");
        });
    });
});

// SHOW LOGIN FORM
router.get("/login", function (req, res) {
    res.render("login");
});

// HANDLE LOGIN LOGIC
router.post("/login", passport.authenticate("local", { successRedirect: "/memos", failureRedirect: "/login" }), function (req, res) { });



// LOGOUT ROUTE
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/memos");
});

// USER PROFILE
router.get("/users/:id", function (req, res) {
    User.findById(req.params.id, function (err, foundUser) {
        if (err) {
            req.flash("error", "Something went wrong.");
            return res.redirect("/memos");
        }
        Memo.find().where('author.id').equals(foundUser._id).exec(function (err, memos) {
            if (err) {
                req.flash("error", "Something went wrong.");
                return res.redirect("/memos");
            }
            res.render("users/show", { user: foundUser, memos: memos });
        });
    });
});

module.exports = router;
