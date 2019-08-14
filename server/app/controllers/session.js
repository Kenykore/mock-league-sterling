const session = require('express-session');
exports.GetSessionValue=async(req,res,next)=>{
    try {
        console.log(process.env.NODE_ENV,"environment")
        if(process.env.NODE_ENV==="development"){
            return next()
        }
        let session= req.session
        
        if(session.email) {
            return next()
        }
        else{
            return await res.status(401).json({success:false,message:"Session expired login first"})
        }
    } catch (error) {
        console.log(error)
        return  next(error)
    }
}
exports.setSessionValue= async(req,res,next)=>{
    try {
        console.log(process.env.NODE_ENV,"environment")
        if(process.env.NODE_ENV=="development"){
            return next()
        }
        req.session.email = req.body.email;
      return  next()
    } catch (error) {
        console.log(error)
      return  next(error)
    }
} 