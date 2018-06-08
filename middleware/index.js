var middleware = {};
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");

middleware.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, campground){
            if(err || !campground){
                req.flash("error", "Cannot find campground!")
                res.redirect("/");
            } else{
                if(campground.author.id.equals(req.user._id)){
                    next();
            } else{
                req.flash("error", "You don't have permission to do that!");
                res.redirect("back");
            }
        }
    })
    } else{
        req.flash("error", "You must be logged in first!");
        res.redirect("back")
    }
}

middleware.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else{
        req.flash("error", "You must be logged in first!");
        res.redirect("/login");
    }
}

middleware.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentId, function(err, comment){
            if(err){
                res.redirect("back");
            } else{
                if(comment.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        })
    } else{
        req.flash("error", "You must be logged in first!");
        res.redirect("back");
    }

}


module.exports = middleware;