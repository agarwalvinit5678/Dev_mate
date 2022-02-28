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
const { forEach } = require('lodash');
const GitHubStrategy = require('passport-github2').Strategy;
var login_value=false;
var searchvalue=false;
var accessToken1="";
var OrgData  = [];
var xlength=0;
var ylength=0;
var zlength=0;

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
  accessToken1="Bearer "+accessToken;
  console.log(accessToken1);
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
    res.redirect('/input');
  });

 

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.get("/input",function(req,res)
{ if(req.isAuthenticated())
  res.render("input",{login_value:req.isAuthenticated()});
  else
  res.render("home",{login_value:req.isAuthenticated()});
  
});

app.get("/",function(req,res)
{
  res.render("home",{login_value:req.isAuthenticated()});
});
app.get("/output",function(req,res)
{
  if(req.isAuthenticated())
  res.render("output",{login_value:req.isAuthenticated()});
  else
  res.render("home",{login_value:req.isAuthenticated()});
  
});
app.get('/profile', function(req, res){

  res.redirect('/');
});
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
app.post("/input",function(req,res){
  if(req.isAuthenticated()==false)
  res.render("home",{login_value:req.isAuthenticated()});
  else
  {
    {

      var options = {
        'method': 'GET',
        'url': 'https://api.github.com/user/orgs',
        'headers': {
          'user-agent': 'node.js',
          'Authorization': accessToken1,
        }
      };
      request(options, function (error, response) 
      {
        if (error) throw new Error(error);
        var dataorg=JSON.parse(response.body);
        //console.log(data);
         xlength = Object.keys(dataorg).length;
        for (var x=0;x<xlength;x++) 
        {
          // var temp = {};
          const repodata=[];
          //console.log(data[x].url);
          var request = require('request');
          var urlmember=dataorg[x].url+'/members';
          var options = {
            'method': 'GET',
            'url': urlmember,
            'headers': {
              'user-agent': 'node.js',
              'Authorization': accessToken1,
            }
          };
          request(options, function (error, response) 
          {
            if (error) throw new Error(error);
            var datauser=JSON.parse(response.body);
             ylength = Object.keys(datauser).length;
            for (var y=0;y<ylength;y++) 
              {
                var options = 
                {
                  'method': 'GET',
                  'url': datauser[y].repos_url,
                  'headers': {
                    'user-agent': 'node.js',
                    'Authorization': accessToken1,
                  }
                };
                request(options, function (error, response) 
                {
                    if (error) throw new Error(error);
                    var datarepo=JSON.parse(response.body);
                     zlength = Object.keys(datarepo).length;
                    for (var z=0;z<zlength;z++) 
                      
                        {
                            var options = {
                              'method': 'GET',
                              'url': datarepo[z].languages_url,
                              'headers': {
                                'user-agent': 'node.js',
                              'Authorization': accessToken1,
                              }
                            };
                            var datalanguage={};
                            request(options, function (error, response) {
                              if (error) throw new Error(error);
                              datalanguage=JSON.parse(response.body);
                              
                            });
                           if(datalanguage["res.languagetosearch"]!==undefined)
                           console.log(datalanguage);
                          repodata.push(datarepo[z]);
                            
                        }
                        //console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
                        //console.log(repodata); 
                  
                });
                console.log("break");
                
              }

          });
          //console.log(repodata);
          //OrgData.push(repodata);
        } 
      });
      //console.log(OrgData);
      //console.log("hello");
    }

    res.redirect("/output");
  }

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
