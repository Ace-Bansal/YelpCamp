var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var passport = require("passport");
var flash = require("connect-flash");
// var passportLocalMongoose = require("passport-local-mongoose");
var LocalStrategy = require("passport-local");
var expressSession = require("express-session");
var User = require("./models/user.js");

var campgroundRoutes = require("./routes/campgrounds.js");
var commentRoutes = require("./routes/comments.js");
var indexRoutes = require("./routes/index.js");

mongoose.connect("mongodb://localhost/yelp_camp_v9");

var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");

var seedDB = require("./seeds.js");

// seedDB();


// Campground.create({
//     name: "Campground 1",
//     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv9n8b2hjD26vxj1jcjSOQk-rgsxZoAvH6LHeUMen7tGOCH6iOww",
//     description: "This is the first campground"
    
// }, function(err, campground){
//     if(err){
//         console.log(err);
//     } else {
//         console.log(campground);
//     }
// })

app.use(flash());
app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.use(expressSession({
    secret: "My name is Ekansh Bansal",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.set("view engine", "ejs");
function middlo(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    return next();
}
app.use(middlo);

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp sever has started!");
});