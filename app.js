//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
var _ = require('lodash');
const ejs = require("ejs");
const mongoose=require("mongoose");
const passport=require("passport");
const session = require("express-session");
const app = express();
const findOrCreate=require('mongoose-findorcreate');
const request = require('request');
const { json } = require('body-parser');
const res = require('express/lib/response');
const GitHubStrategy = require('passport-github2').Strategy;
var login_value=false;

app.use(session({
  secret:"this is secret",
  resave:false,
  saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://admin:admin1234@cluster1.igkpg.mongodb.net/GitMatedb");
const userSchema=new mongoose.Schema({
  githubId:String});
  userSchema.plugin(findOrCreate);
const User = new mongoose.model("User",userSchema);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/github/callback"
},
function(accessToken, refreshToken, profile, done) {
  User.findOrCreate({ githubId: profile.id }, function (err, user) {
    return done(err, user);
  });
}
));

app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

 

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.get("/",function(req,res){
res.render("home",{login_value:req.isAuthenticated()});
if(req.isAuthenticated())
{
  var options = {
    // url:"https://api.github.com/users/agarwalvinit5678/repos",
    url:"https://api.github.com/user/orgs",
    method: 'GET',
    headers: {'user-agent': 'node.js'}
};
  request(options, function (error, response, body) {
    console.log(body);
    if (!error && response.statusCode == 200) {
      console.log(body) // Show the HTML for the Google homepage.
      var data=JSON.parse(body);
      
          console.log(data); 
    }
  });
}

});

app.get('/profile', function(req, res){

  res.redirect('/');
});
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
