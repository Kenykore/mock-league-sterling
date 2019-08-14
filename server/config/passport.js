var passport=require('passport');
var User= require('../app/models/user')
var jwt = require('jsonwebtoken'); 
var config=require('./auth')
var JwtStrategy= require('passport-jwt').Strategy
var ExtractJwt=require('passport-jwt').ExtractJwt
var LocalStrategy= require('passport-local').Strategy
var BearerStrategy = require('passport-http-bearer').Strategy;
var localOptions={
    usernameField:'email'
};
var localLogin= new LocalStrategy(localOptions,((email,password,done) => {
    User.findOne({
        email:email
    },(err,user) => {
        if(err){
            return done(err)
        }
        if(!user){
            return done(null,false,
                {error:"User doesn't exist.Please try again"})
        }
user.comparePassword(password,(err,isMatch) => {
    if(err){
        return done(err)
    }
    if(!isMatch){
        return done(null,false,{error:"Password incorrect. Try Again"})
    }
    return done(null,user,{message: 'Logged In Successfully'});
})
    })
}))

var jwtOptions={
    jwtFromRequest:  ExtractJwt.fromAuthHeaderWithScheme("jwt"),
    secretOrKey:config.secret
}
var jwtLogin = new JwtStrategy(jwtOptions,((payload,done) => {
    User.findById(payload._id,(err,user) => {
        if(err){
            return done(err,false);
        }
        if(user){
            done(null,user)
        } else{
            done(null,false)
        }
    })
}))
var BearerAuth=new BearerStrategy(
   async function(token, cb) {
       try {
         let user= await User.findOne({api_key:token}).lean()
        if (!user) { return cb(null, false,{error:"You are not authorized to view this content"}); }
        if(user.user_type==="Admin"){
            return cb(null, user);
        }
          else{
            return cb(null, false,{error:"You are not authorized to view this content"});      
            }
       
        } catch (err) {
        return cb(err);
       
    }
  
        
   
    })
passport.use(BearerAuth)    
passport.use(jwtLogin);
passport.use(localLogin);

