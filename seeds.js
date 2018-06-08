var mongoose = require("mongoose");
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");

var data = [
        {
            name: "Camp1",
            image: "https://www.nhstateparks.org/uploads/images/Dry-River_Campground_02.jpg",
            description: "Nice campground"
        },
        {
            name: "Camp2",
            image: "https://www.nhstateparks.org/uploads/images/Dry-River_Campground_02.jpg",
            description: "Nice campground asdasdasd"
        },
        {
            name: "Camp3",
            image: "https://www.nhstateparks.org/uploads/images/Dry-River_Campground_02.jpg",
            description: "Nice campground qweqweqwe"
        }
   ];

function seedDB(){
    Campground.remove({}, function(err){
    });
}

module.exports = seedDB;