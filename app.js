//Port enabler
var port = process.env.PORT || 1001
// var morgan = require('morgan')
var express = require('express')
var app = express()
var favicon = require('serve-favicon')
var path = require('path')
var bodyParser = require("body-parser")
// var fs = require('fs')
var jsfile = require('./routes/routes.js')
var session = require('express-session')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : false }))
var cookieParser = require('cookie-parser')
var expressfileupload = require("express-fileupload")
app.use(expressfileupload())

app.use(session({
  secret: 'token',
  resave: false,
  saveUninitialized: true
}));

var nunjucks = require ('nunjucks');
nunjucks.configure('views',{
	autoescape: true,
	noCache: true,
	express: app
});
//js file function called
jsfile(app);
// jsfile2(app);
//Set engine
app.use(express.static('./public'));
//port calling 
app.listen(port)
