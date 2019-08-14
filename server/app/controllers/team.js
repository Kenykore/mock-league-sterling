var User = require('../models/user');
var Team= require('../models/teams')
var Counter=require('../models/counter')
exports.CreateTeam= async (req,res,next)=>{
      try{
        let team=req.body.team
        if(!team){
            return res.status(422).send({error: 'You must enter team info',success:false});
        }
        let counter_find= await Counter.findOne({name:'team'})
        if(counter_find){
            let id_counter= await Counter.findOneAndUpdate({name:"team"},{
                $inc:{"value":1}
             },{
                 new:true
             }).lean()
             const id=id_counter.value.toString()
               team.team_id=id
             const team_create= await Team.create(team)
             return await res.status(201).json({team:team_create,success:true})
        }
        else{
            await Counter.create({name:'team',value:1})
            const id='1'
            team.team_id=id
          const team_create= await Team.create(team)
          return await res.status(201).json({team:team_create,success:true})

        }
       
      }
      catch(err){
          next(err)
          return await res.status(500).json({error:err,success:false,message:"error creating team"})
      }
}
exports.GetAllTeams= async(req,res,next)=>{
  try {
      let fixtures_get= await Team.find({}).lean()
      req.body.redis_value=fixtures_get
      return next()
  } catch (error) {
      console.log(err)
      next(err)
      return await  res.status(500).json({error:error,success:false,message:`getting fixtures failed`})    
  }
}
exports.FilterTeam= async (req,res,next)=>{
    try{
       let team_response= await Team.find({[req.query.filter]:req.query.value})
              console.log(team_response)
              req.body.redis_value=team_response
      return next()
    }
    catch(err){
        console.log(err)
        next(err)
        return await  res.status(500).json({error:err,success:false,message:`getting team failed`})
      
    }
}
exports.updateTeam= async(req,res,next)=>{
    try{
        let team_response= await Team.findOneAndUpdate({team_id:req.body.team_id},req.body.update,{new:true})
        console.log(team_response)
        return await res.status(200).json({success:true,team:team_response})
     }
     catch(err){
         console.log(err)
         next(err)
         return   await res.status(500).json({error:err,success:false,message:`updating team failed`})
    
     }   
}
exports.DeleteTeam=async(req,res,next)=>{
    try{
        let team_response= await Team.findOneAndRemove({team_id:req.body.team_id})
        console.log(team_response)
        return await res.status(200).json({success:true,team:team_response})
     }
     catch(err){
         console.log(err)
         next(err)
         return await  res.status(500).json({error:err,success:false,message:`updating team failed`})
       
     }   
}
// exports.CreateTx= async (req,res,next)=>{
//     try{
//      let action= req.body.action
//      let amount=req.body.amount
//      let time= req.body.time
//      let user= req.body.user
//      let reason=req.body.reason
//      if(action==="credit"){
        
//    let response=await Wallet.findOneAndUpdate({user:user},{ $inc: { balance: amount },
//         $push: {
//             "tx": {
//                 action:"credit",
//                 time:time,
//                 amount:amount,
//                 reason:reason
//             }
//         }
//     },{
//         safe:true,
//         new:true
//     })
// await res.json({success:true,message:"Credit Tx Successfull"})
//      }
//      if(action==="debit"){
//          let debitamt=Number(amount*-1)
//         let response=await Wallet.findOneAndUpdate({user:user},{ $inc: { balance: debitamt },
//             $push: {
//                 "tx": {
//                     action:"debit",
//                     time:time,
//                     amount:amount,
//                     reason:reason
//                 }
//             }
//         },{
//             safe:true,
//             new:true
//         })
//     await res.json({success:true,message:"Debit Tx Successfull"})
//      }

//     }
//     catch(err){
//         res.json({error:err,success:false,message:`${action} tx failed`})
//         return next(err)
//     }
// }
