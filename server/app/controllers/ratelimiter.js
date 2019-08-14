var client= require('../../config/redis')
const rateLimit = require("express-rate-limit");
var RedisStore = require('rate-limit-redis');
var app= require("../app")
var limiter = require('express-limiter')(app,client)
var User=require('../models/user')
// var FixturesLimiter= require('express-limiter')(FixturesRoutes, client)
async function validApiKey(key){
try {
  if(!key){
    return false
  }
    let user= await User.findOne({api_key:key})
    if(user){
        return true
    }
    else{
        return false
    }
} catch (error) {
   console.log(error)
   return false 
}
}

module.exports= limiter({
   lookup:async function(req, res, opts, next) {
       try {
        if (await validApiKey(req.query.api_key)) {
            opts.lookup = 'query.api_key'
            opts.total = 50
            opts.expire=1000 * 60 * 60
          } else {
            opts.lookup = 'connection.remoteAddress'
            opts.total = 20
            opts.expire=1000 * 60 * 60
          }
       } catch (error) {
         console.log(error)
        opts.lookup = 'connection.remoteAddress'
        opts.total = 20
        opts.expire=1000 * 60 * 60
       }
       return next()   
   },
   onRateLimited:function(req,res,next){
     res.status(429).json({message:"rate excceded,get an api key to increase rate",success:false})
   }
 })
