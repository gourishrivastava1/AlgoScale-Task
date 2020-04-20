var express                 =   require("express"),
LocalStrategy           =   require("passport-local"),
bodyParser              =   require("body-parser"),
mongoose                =   require("mongoose"),
app                     =   express(),
passportLocalMongoose   =   require("passport-local-mongoose"), 
passport                =   require("passport"),
User                    =   require("./models/user");
mongoose.connect("mongodb://localhost/algoscale",{ useNewUrlParser: true,useUnifiedTopology: true });
app.set('view engine','ejs');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")({secret:"GouriKey",resave: false,saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
    res.locals.currentUser  = req.user;
    next();
});
app.get("/register",function(req,res){
    req.logout();
    res.render("register");
});
app.post("/register",function(req,res){
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.render("register");
        } else {
            passport.authenticate("local")(req,res,function(){
                res.redirect("show");
            });
        }
    });
});
app.get("/",function(req,res){
    req.logout();
    res.redirect("login");
});
app.get("/login",function(req,res){
    req.logout();
    res.render("login");
});
app.post("/login",passport.authenticate("local",{
    successRedirect: "/show",
    failureRedirect: "/register"
}),function(req,res){
});
app.get("/show",isLoggedIn,function(req,res){
    User.find({},function(err,allUsers){
        if(err){
            console.log(err);
        }
        else{
            res.render("show",{Users:allUsers});
        }
    });
});
app.post("/search",isLoggedIn,function(req,res){
    User.find({username:req.body.searchvalue},function(err,foundUser){
        User.find({},function(err,allUsers){
            res.render("search",{foundUsers:foundUser,Users:allUsers});
        });
    });
});
app.get("/delete/:user_id",function(req,res){
    User.findByIdAndRemove(req.params.user_id,function(err){
        if(err){
            res.send(err);
        } else {
            res.redirect("/show");
        }
    });
});
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/login");
});
function isLoggedIn(req,res,next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};
app.listen(3000,function(req,res){
    console.log("server started");
});