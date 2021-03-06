const express =require('express')
const request = require('request');
const app = express();
const flash = require("connect-flash");
const User = require("./Db/User");
const Vendor = require("./Db/Vendor");
var session = require("express-session");
var bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
app.use(flash());
app.use(bodyParser.urlencoded({extended:true}))
app.use( '/use' ,express.static(__dirname + '/Public' ) );
app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'shhhh, very secret lubba wubba dubba etc'
}));
app.use(function(req, res, next) {
    if (req.session.isLoggedIn) {
       res.locals.currentUser  = req.session.user;
        data1=res.locals.currentUser
       // console.log(data1)
    } else {
        data1=null;
        res.locals.currentUser = null;
    }
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.set("view engine","ejs")
const connectDB = require('./Db/connection');
connectDB();
app.get("/", (req, res)=>{
    res.render("index.ejs",{
        title : "Home"
    })
 
 });
 app.get("/about", (req, res)=>{
    res.render("about.ejs",{
        title : "About"
    })
 
 });
 app.get("/contact", (req, res)=>{
    res.render("contact.ejs",{
        title : "Contact"
    })
 
 });
 app.post("/signup", (req, res)=>{
    console.log(req.body);
    console.log("Signup Request");
    
    let hash = bcrypt.hashSync(req.body.password, 14);
    req.body.password = hash;
    let registered_user = new User(req.body);
    console.log(registered_user);
    registered_user.save(function(err, doc) {
        if (err) {
            req.flash("error", "Already Taken Email");
            console.log("Already Taken Username");
            res.redirect("/");
        } else {

            req.flash("success", "Signup was successfully, now you can login");
            console.log("Login Success");
            res.redirect("/");
        }
    });
});
app.post("/signupv", (req, res)=>{
    console.log(req.body);
    console.log("Signup Request 2");
    let hash = bcrypt.hashSync(req.body.password, 14);
    req.body.password = hash;
    let registered_user = new Vendor(req.body);
    console.log(registered_user);
    registered_user.save(function(err, doc) {
        if (err) {
            req.flash("error", "Already Taken Email");
            console.log("Already Taken Username");
            res.redirect("/");
        } else {

            req.flash("success", "Signup was successfully, now you can login");
            console.log("Login Success");
            res.redirect("/");
        }
    });
});
app.post("/login", function(req, res) {
    //console.log(req.body);
    User.findOne({ email: req.body.Email}, (err, user) => {
        console.log(req.body);
        console.log(err);
        if (err || !user || !(bcrypt.compareSync(req.body.password, user.password))  ) {
            req.flash("error", "Incorrect Username/Password");
            req.session.isLoggedIn = false;
            console.log("Login is Unsuccessfull");
            res.redirect("/");
        } else {
             
             console.log("Login is successfull");
             req.flash("success", "Login Successful");
            //Setting Up the session
            req.session.isLoggedIn = true;
            req.session.user = user;
            res.redirect("/");
        }
    });
});
app.get("/logout", function(req, res) {
    if (req.session) {
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});
app.get("/Tshirts", function(req, res) {
    Vendor.find({},(err,d)=>{
      console.log(d);
      res.render("mens.ejs",{
        vdata :d,
        title:"Tshirts"
    })
    });  
});
app.listen(5000, function(){
    console.log("Server Has Started");
});