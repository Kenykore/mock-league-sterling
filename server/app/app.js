const path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var methodOverride = require('method-override')
const session = require('express-session');
const redis = require('redis');
require('dotenv').config()
const redisStore = require('connect-redis')(session);
const client=require('../config/redis')
var nodemailer=require('nodemailer')
var router = require('./routes');
var app = express();
//configuration
//1. Redis
client.on('error', (err) => {
  console.log("Error " + err);
});
client.on('connect', () => {   
    console.log("connected");
});                               
//2.Express Configuration
  app.use(session({
    secret: 'ssshhhhh',
    store: new redisStore({ host: 'redis-18481.c17.us-east-1-4.ec2.cloud.redislabs.com', port:18481, client: client,ttl : 260}),
    saveUninitialized: false,
    resave: false
  }))


app.set('trust proxy', 1)
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(methodOverride());

router(app);
module.exports=app