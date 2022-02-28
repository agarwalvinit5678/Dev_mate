
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
let _ = require('lodash');
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
let login_value=false;
let searchvalue=false;
let accessToken1="";
let OrgData  = [];
let xlength=0;
let ylength=0;
let zlength=0;
let options = {
  'method': 'GET',
  'url': 'https://api.github.com/users/agarwalvinit5678/repos',
  'headers': {
    'user-agent': 'node.js',
    'Authorization': "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",

    
    
  }
};
let datarepo={};
let datarepoarr=[];
request(options, function (error, response) {
  if (error) throw new Error(error);
  datarepo=JSON.parse(response.body);
 // console.log(datarepo[0].languages_url);
//console.log(datarepo);

zlength = Object.keys(datarepo).length;
for (let z=0;z<zlength;z++) 
  
    {
        let options = {
          'method': 'GET',
          'url': datarepo[z].languages_url,
          'headers': {
            'user-agent': 'node.js',
            'Authorization': "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"
          
          }
        };
        let datalanguage={};
        request(options, function (error, response1) {
          if (error) throw new Error(error);
          datalanguage=JSON.parse(response1.body);
          datarepoarr.push(datalanguage);

          
          
        });
        console.log(datarepoarr); 

    //    if(datalanguage["res.languagetosearch"]!==undefined)
       
     // 
      
    }
    
});
