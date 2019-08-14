var Counter=require('../models/counter')
var Fixtures=  require('../models/fixtures')
var ObjectID = require('mongoose').Types.ObjectId

exports.CreateFixtures= async(req,res,next)=>{
    try {
        let fixtures=req.body.fixtures
        if(!fixtures){
            return res.status(422).send({error: 'You must enter fixture info',success:false});
        }
        let counter_find= await Counter.findOne({name:'fixture'})
        if(counter_find){
            let id_counter= await Counter.findOneAndUpdate({name:"fixture"},{
                $inc:{"value":1}
             },{
                 new:true
             }).lean()
             const id=id_counter.value.toString()
               
             const fixture_create= await Fixtures.create({
                Home_Team:ObjectID(fixtures.Home_Team),
                Away_Team:ObjectID(fixtures.Away_Team),
                match_status:"NS",
                start_time:fixtures.start_time,
                fixture_id:id
             })
             return await res.status(201).json({fixture:fixture_create,success:true})
        }
        else{
            await Counter.create({name:'fixture',value:1})
            const id='1'
            
            const fixture_create= await Fixtures.create({
                Home_Team:ObjectID(fixtures.Home_Team),
                Away_Team:ObjectID(fixtures.Away_Team),
                match_status:"NS",
                fixture_id:id
             })
             return await res.status(201).json({fixture:fixture_create,success:true})

        }
    } catch (error) {
        next(error)
        return await res.status(500).json({error:error,success:false,message:"error creating fixture"})
    }
}
exports.GetAllFixtures= async(req,res,next)=>{
    try {
        let fixtures_get= await Fixtures.find({}).populate({path:" Home_Team",select:"-_id"}).populate({path:" Away_Team",select:"-_id"}).lean()
        req.body.redis_value=fixtures_get
        return next()
    } catch (error) {
        console.log(error)
        next(err)
        return await  res.status(500).json({error:error,success:false,message:`getting fixtures failed`})    
    }
}

exports.filterFixtures= async(req,res,next)=>{
    try {
        let fixtures_get= await Fixtures.find({[req.query.filter]:req.query.value}).populate({path:" Home_Team",select:"-_id"}).populate({path:" Away_Team",select:"-_id"}).lean()
        req.body.redis_value=fixtures_get
        return next()
    } catch (error) {
        console.log(error)
        next(error)
        return await  res.status(500).json({error:error,success:false,message:`getting fixtures failed`})     
    }
}
exports.GenerateFixturesLink= async(req,res,next)=>{
    try {
        let fixture_id=req.body.fixture_id
        if(!fixture_id){
            return res.status(422).send({error: 'You must enter team info',success:false});
        }
        const fixture_get= await Fixtures.findOne({fixture_id:fixture_id}).populate({path:" Home_Team",select:"-_id"}).populate({path:" Away_Team",select:"-_id"}).lean()
        if(fixture_get){
            return  await res.status(200).json({
                "link":`http://localhost:3100/api/fixture/${fixture_id}`,
                success:true
            }) 
        }
        else{
            return await res.status(200).json({
                "link":`N/A`,
                success:false
            }) 
        }
    } catch (error) {
        console.log(error)
        next(err)
        return await  res.status(500).json({error:error,success:false,message:`generating fixture link failed`})     
 
    }
}
exports.GetFixturesLink=async(req,res,next)=>{
     try {
         const fixture_id=req.params.id
         const fixture_get=await Fixtures.findOne({fixture_id:fixture_id}).populate({path:" Home_Team",select:"-_id"}).populate({path:" Away_Team",select:"-_id"}).lean()
         req.body.redis_value=`http://localhost:3100/api/fixture/${fixture_get.fixture_id}`
         return next()
        } 
        catch (error) {
        console.log(error)
        next(error)
        return await  res.status(500).json({error:error,success:false,message:`getting fixture link failed`})     
         
     }
}
exports.updateFixtures =async(req,res,next)=>{
    try{
        let fixture_response= await Fixtures.findOneAndUpdate({fixture_id:req.body.fixture_id},req.body.update,{new:true})
        return await res.status(200).json({success:true,fixture:fixture_response})
     }
     catch(err){
         console.log(err)
         next(err)
         return   await res.status(500).json({error:err,success:false,message:`updating fixture failed`})
    
     }   
}
exports.DeleteFixture=async(req,res,next)=>{
    try{
        let fixture_response= await Fixtures.findOneAndRemove({fixture_id:req.body.fixture_id})
        return await res.status(200).json({success:true,fixture:fixture_response})
     }
     catch(err){
         console.log(err)
         next(err)
         return await  res.status(500).json({error:err,success:false,message:`deleting fixture failed`})
       
     }   
} 