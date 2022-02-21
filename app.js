//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
var _ = require('lodash');
const ejs = require("ejs");
const mongoose=require("mongoose");
const session = require("express-session");
const app = express();
const request = require('request');
const { json } = require('body-parser');
app.use(session({
  secret:"this is secret",
  resave:false,
  saveUninitialized:false
}));



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.get("/",function(req,res){
 
res.render("home");
});

// request( function (error, response, body) {
//   console.log(error);
//   if (!error && response.statusCode == 200) {
//     console.log(body);
//     var data=JSON.parse(body);
    
//     console.log(data);
//   }
// });
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
