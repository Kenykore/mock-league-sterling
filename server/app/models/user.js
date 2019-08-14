var mongoose=require('mongoose');
var bcrypt=require('bcrypt-nodejs')
var moment= require('moment')
var UserSchema= new mongoose.Schema({

 email:{
         type:String,
         lowercase:true,
         unique:true,
         required:true
        },
        user_type:{
            type:String,
            enum:['individual','Admin'],
            default:'individual',
            required:true
          },
        password: {
            type: String,
            required: true,
        },
   
      api_key:{
        type:String,
        lowercase:true,
        required:false
      },
        resetPasswordToken:{
      type:String,
    default:"adddddsbjugsj"},
  resetPasswordExpires:Date,
  
Activated:{
    type:Boolean,
    default:true
},


    },{
        timestamps:true
    }
)
UserSchema.pre('save',function(next){
    var user=this;
    var SALT_FACTOR=5;
    if(!user.isModified('password')){
        return next();
    }
    bcrypt.genSalt(SALT_FACTOR,function(err,salt){
        if(err){
        return next(err)
        }
bcrypt.hash(user.password,salt,null,function(err,hash){
    if(err){
        return next(err)
    }
    user.password=hash;
    next()
})
    })
})

UserSchema.methods.comparePassword = function(passwordAttempt, cb){
 
    bcrypt.compare(passwordAttempt, this.password, function(err, isMatch){
 
        if(err){
            return cb(err);
        } else {
            cb(null, isMatch);
        }
    });
 
}

module.exports = mongoose.model('User', UserSchema);