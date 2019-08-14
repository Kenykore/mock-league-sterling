var jwt = require('jsonwebtoken'); 
var User = require('../models/user');
var authConfig = require('../../config/auth');
var crypto=require('crypto') 
var bcrypt=require('bcrypt-nodejs')
var nodemailer=require('nodemailer')
const UIDGenerator = require('uid-generator');
var async=require('async')


function generateToken(user){
    return jwt.sign(user, authConfig.secret, {
        expiresIn: "5 days"
    });
} 
function setUserInfo2(request){
    return {
        _id: request._id,
        email: request.email,     
        user_type:request.user_type,
    };
}
exports.login = async function(req, res, next){
    try {
        let email=req.body.email
        let user= await User.findOne({email:email}).select("email user_type api_key Activated").lean()
            let activated=user.Activated
           
            if(activated===true){
               
                var userInfo = setUserInfo2(req.user);
         
            return  await res.status(200).json({
                    token: 'jwt ' + generateToken(userInfo),
                    user: user,
                    success:true
                });
           
            }
            else{
                return res.status(422).send({error: 'Your account is deactivated',success:false});
             }

    } catch (error) {
        return res.status(500).json({error:error,success:false,message:"unable to login"})
   
    } 
}
exports.RegisterAdmin= async function(req, res, next){
    try{
       
       const email = req.body.email;
       const password=req.body.password;
       const UserType="Admin";
        if(!email){
            return res.status(422).send({error: 'You must enter an email address',success:false});
        }
       if(!password){
            return res.status(422).send({error: 'You must enter a password',success:false});
        }  
     let findexistinguser= await  User.findOne({email: email}).lean()
     if(findexistinguser){
            
              return await res.status(422).send({error: 'That email address is already in use'});
                }
      const uidgen = new UIDGenerator();
      let token=await uidgen.generate()
      let user= await User.create({
                    email: email,
                    password: password,
                    user_type:UserType,     
                    api_key: token
                     })
    
    let userInfo = setUserInfo2(user);
        return await  res.status(201).json({
                token: 'jwt ' + generateToken(userInfo),
                user: userInfo,
                apiKey:user.api_key,
                success:true
            })
            }
    
    catch(err){
        console.log(err)
        next(err)
        return res.status(500).json({error:err,success:false,message:"unable to register"})
    
            }
    }
exports.register =  async function(req, res, next){
try{
   
   const email = req.body.email;
   const password=req.body.password;
   const UserType="individual";
    if(!email){
        return res.status(422).send({error: 'You must enter an email address',success:false});
    }
   if(!password){
        return res.status(422).send({error: 'You must enter a password',success:false});
    }  
 let findexistinguser= await  User.findOne({email: email}).lean()
 if(findexistinguser){
         
          return await res.status(422).send({error: 'That email address is already in use'});
            }
  const uidgen = new UIDGenerator();
  let token=await uidgen.generate()
  let user= await User.create({
                email: email,
                password: password,
                user_type:UserType,     
                api_key: token
                 })
let userInfo = setUserInfo2(user);
    return await  res.status(201).json({
            token: 'jwt ' + generateToken(userInfo),
            user: userInfo,
            apiKey:user.api_key,
            success:true
        })
        }

catch(err){
    console.log(err)
    next(err)
    return res.status(500).json({error:err,success:false,message:"unable to register"})

        }
}
exports.resetPassword=function(req, res, next){
    var email=req.body.email
async.waterfall([
    function(done){
        crypto.randomBytes(10,(err,buf) => {
var token=buf.toString('hex')
done(err,token)
        })
    },
    function(token,done){
        var expiry=Date.now()+360000000
        User.update({email:req.body.email},
            { $set: { resetPasswordToken: token,resetPasswordExpires:expiry}}
            ,(err,user)=>{
            if(err){
                next(err)
                return res.json({message:"No account with email found"})
            }
                         done(err,token,user)
        })
    },
    function(token,user,done){
              return  res.status(200).json({"token":token,success:true})
            
    }
],(err) => {
    if(err){
    console.log(err)
    res.status(500).json({"error":err,success:false})
    }
})
}
exports.changeUserPassword=  function (req, res, next){
var token=req.body.token
var password=req.body.password
var SALT_FACTOR=5;
       var salt= bcrypt.genSaltSync(SALT_FACTOR)
    var pass  = bcrypt.hashSync(password,salt)
         User.update({resetPasswordToken:token,resetPasswordExpires:{$gt:Date.now()}},
           { $set:{ resetPasswordToken:undefined,resetPasswordExpires:undefined,password:pass}},
             (err,user)=>{
    if(err){
        res.json({error:`Password reset token expired or invalid token`,success:false})
    } 
              return  res.status(200).json({"message":"Password change sucessfully",success:true})
            });
 
        
    }


exports.UpdateProfile= async function(req, res, next){
    try {
        const email = req.body.email;
      const id=req.body._id; 
const update={
    email:email,
}
let user= await User.findByIdAndUpdate(id,update,{new:true})
return await res.status(200).json({
    success:true,
    user:user
})
    } catch (error) {
        next(error)
        return res.status(500).json({error:error,success:false,message:"error updating profile"})
    }
      
}
exports.deleteAccount=async (req,res,next)=>{
    try {
        const email = req.body.email;
        await User.findOneAndRemove({email:email})
        return res.status(200).json({success:true})
    } catch (error) {
        next(error)
        return res.status(500).json({error:error,success:false,message:"error deleting profile"})

    }
}
exports.roleAuthorization = async function(req,res,next){
    try {
       const header= req.headers['authorization']
       if(header!==undefined){
        const token=header.split(" ")[1] 
        const payload= jwt.decode(token,{json:true,complete:true})
         let user_find= await User.findById(payload.payload._id).lean()
         if(user_find.user_type==="Admin"){
           next()
         }
         else{
           return await res.status(403).json({error: 'You are not authorized to view this content',success:false});
         }
       }
  else{
    return await res.status(403).json({error: 'You are not authorized to view this content',success:false});
  }
    
    } catch (error) {
        next(error)
        return res.status(500).json({error:error,success:false})
    } 
    }
 
