var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else{
                res.render("comments/newComment", {campground: campground});
        }
    })
})
router.post("/", middleware.isLoggedIn, function(req, res){
    var comment = req.body.comments;
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
        } else{
            Comment.create(comment, function(err, createdComment){
                if(err){
                    console.log(err);
                } else{
                    // console.log(req.user);
                    createdComment.author.username = req.user.username;
                    createdComment.author.id = req.user._id;
                    createdComment.save();
                    campground.comments.push(createdComment);
                    campground.save();
                    // console.log("");
                    req.flash("success", "Added new comment");
                    res.redirect("/campgrounds/"+req.params.id);
                }
            })
        }
    })
}
)

router.get("/:commentId/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.commentId, function(err, comment){
        res.render("comments/edit", {campgroundId: req.params.id, comment: comment});
    })
})

router.put("/:commentId", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comments, function(err, comment){
        if(err){
            console.log("error on the comment update route!!!");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

router.delete("/:commentId", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndDelete(req.params.commentId, function(err){
        if(err){
            res.redirect("back");
        } else{
            req.flash("success", "Removed comment");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})


module.exports = router;