var express = require("express");
var router = express.Router();
var Campground = require("../models/campground.js");
var middleware = require("../middleware");

router.get("/", function(req, res) {
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    })
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/newCamp");
});

router.get("/:id", function(req, res){
    var id = req.params.id;
    Campground.findById(id).populate("comments").exec(function(err, foundCamp){
        if(err || !foundCamp){
            // console.log(err);
            req.flash("error", "Campground not found!");
            res.redirect("/campgrounds");
        }
        else{
            res.render("campgrounds/show", {campground: foundCamp});
        }
    })
});

router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.desc;
    var newCampground = {
        name: name,
        image: image,
        description: desc,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    };
    Campground.create(newCampground, function(err, campground){
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds");
        }
    })
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err || !campground){
            req.flash("error", "Cannot find campground!");
            res.redirect("/campgrounds");
        } else{
            res.render("campgrounds/edit.ejs", {campground: campground})
        }
    })
})

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    var campground = req.body.campground;
    Campground.findByIdAndUpdate(req.params.id, campground, function(err, campground){
        if(err){
            console.log("error on edit/update campground route!!!");
        } else{
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
})

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndDelete(req.params.id, function(err){
        if(err){
            console.log("error on the delete route!!!");
        } else{
            res.redirect("/campgrounds");
        }
    })
})



module.exports = router;