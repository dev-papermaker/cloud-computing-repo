var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
    name: String,
    status: Number,
    company: String,
    description: String,
    category: String,
    likeNum: Number,
    dislikeNum: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

module.exports = mongoose.model("Campground", campgroundSchema);
