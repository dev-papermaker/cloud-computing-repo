var mongoose = require("mongoose");

var memoSchema = new mongoose.Schema({
    user_senior: Boolean,
    memo_title: String,
    memo_description: String,
    memo_topic: String,
    memo_likenum: Number,
    memo_dislikenum: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        company: String,
        industry: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

module.exports = mongoose.model("Memo", memoSchema);
