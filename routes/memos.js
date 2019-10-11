var express = require("express");
var router = express.Router();
var Memo = require("../models/memo");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//INDEX - show all memos
router.get("/", function (req, res) {
    var noMatch = null;
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Memo.find({ memo_title: regex }, function (err, allMemos) {
            if (err) {
                console.log(err);
            }
            else {
                if (allMemos.length < 1) {
                    noMatch = "No memos match, please try again. ";
                }
                res.render("memos/index", { memos: allMemos, noMatch: noMatch });
            }
        });
    } else {
        // Get all memos from DB
        Memo.find({}, function (err, allMemos) {
            if (err) {
                console.log(err);
            }
            else {
                res.render("memos/index", { memos: allMemos, noMatch: noMatch });
            }
        });
    }

});

//CREATE - add new memo to DB
router.post("/", middleware.isLoggedIn, function (req, res) {
    // get data from form and add to memos array
    var user_senior = req.body.user_senior;
    var memo_title = req.body.memo_title;
    var memo_description = req.body.memo_description;
    var memo_topic = req.body.memo_topic;
    var memo_likenum = req.body.memo_likenum;
    var memo_dislikenum = req.body.memo_dislikenum;
    var author = { id: req.user._id, username: req.user.username, industry: req.user.industry, company: req.user.company };
    var newMemo = {
        user_senior: user_senior,
        memo_title: memo_title,
        memo_description: memo_description,
        memo_topic: memo_topic,
        memo_likenum: memo_likenum,
        memo_dislikenum: memo_dislikenum,
        author: author
    };
    // Create a new memo and save to DB
    Memo.create(newMemo, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        }
        else {
            //redirect back to memos page
            res.redirect("/memos");
        }
    });
});

//NEW - show form to create new memo
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("memos/new");
});

// SHOW - shows more info about one memo
router.get("/:id", function (req, res) {
    //find the memo with provided ID
    Memo.findById(req.params.id).populate("comments").exec(function (err, foundMemo) {
        if (err) {
            console.log(err);
        }
        else {
            //render show template with that campground
            res.render("memos/show", { memo: foundMemo });
        }
    });

});

// EDIT MEMO ROUTE
router.get("/:id/edit", middleware.checkMemoOwnership, function (req, res) {
    Memo.findById(req.params.id, function (err, foundMemo) {
        res.render("memos/edit", { memo: foundMemo });
    });
});

// UPDATE MEMO ROUTE
// IT'S A PUT REQUEST
router.put("/:id", middleware.checkMemoOwnership, function (req, res) {
    // FIND AND UPDATE THE MEMO
    Memo.findByIdAndUpdate(req.params.id, req.body.memo, function (err, updatedMemo) {
        if (err) {
            res.redirect("/memos");
        }
        else {
            res.redirect("/memos/" + req.params.id);
        }
    });
});

// DESTROY MEMO ROUTE
router.delete("/:id", middleware.checkMemoOwnership, function (req, res) {
    Memo.findByIdAndRemove(req.params.id, function (err, memoRemoved) {
        if (err) {
            res.redirect("/memos");
        }
        else {
            res.redirect("/memos");
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;
