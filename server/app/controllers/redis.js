const client=require('../../config/redis')
exports.RetriveTeamRedisValue= function(req,res,next){
    try {
    client.get("team",(err,result)=>{

    if(result){
        const resultJSON = JSON.parse(result);
        return res.status(200).json({teams:resultJSON.team,success:true,source:"redis"})
    }
    else{
        next()
    }
        })
    } catch (error) {
        console.log(error)
        return next(error)
    }
}
exports.setTeamRedisvalue= (req,res,next)=>{
    try {
        client.setex(`team`, 120, JSON.stringify({team:req.body.redis_value}));
        return res.status(200).json({source:"api",teams:req.body.redis_value,success:true})
    } catch (err) {
        console.log(err)
        return res.status(500).json({error:err,success:false})
    }
}
exports.RetriveFixturesRedisValue= function(req,res,next){
    try {
    client.get("fixture",(err,result)=>{

    if(result){
        const resultJSON = JSON.parse(result);
        return res.status(200).json({fixtures:resultJSON.fixtures,success:true,source:"redis"})
    }
    else{
        next()
    }
        })
    } catch (error) {
        console.log(error)
        return next(error)
    }
}
exports.setFixturesRedisvalue= (req,res,next)=>{
    try {
        client.setex(`fixture`, 120, JSON.stringify({fixtures:req.body.redis_value}));
        return res.status(200).json({source:"api",fixtures:req.body.redis_value,success:true})
    } catch (err) {
        console.log(err)
        return res.status(500).json({error:err,success:false})
    }
}
exports.getTeamQueryValue=function(req,res,next){
    try {
    client.get(`team/${req.query.filter}/${req.query.value}`,(err,result)=>{

    if(result){
        const resultJSON = JSON.parse(result);
        return res.status(200).json({teams:resultJSON.team,success:true,source:"redis"})
    }
    else{
        next()
    }
        })
    } catch (error) {
        console.log(error)
        return next(error)
    }
}
exports.setTeamQueryRedisValue=(req,res,next)=>{
    try {
        client.setex(`team/${req.query.filter}/${req.query.value}`, 120, JSON.stringify({team:req.body.redis_value}));
        return res.status(200).json({source:"api",teams:req.body.redis_value,success:true})
    } catch (err) {
        console.log(err)
        return res.status(500).json({error:err,success:false})
    }
}
exports.getFixturesQueryRedisValue=function(req,res,next){
    try {
    client.get(`fixture/${req.query.filter}/${req.query.value}`,(err,result)=>{

    if(result){
        const resultJSON = JSON.parse(result);
        return res.status(200).json({fixtures:resultJSON.fixtures,success:true,source:"redis"})
    }
    else{
        next()
    }
        })
    } catch (error) {
        console.log(error)
        return next(error)
    }
}
exports.setFixturesQueryRedisValue=(req,res,next)=>{
    try {
        client.setex(`fixture/${req.query.filter}/${req.query.value}`, 120, JSON.stringify({fixtures:req.body.redis_value}));
        return res.status(200).json({source:"api",link:req.body.redis_value,success:true})
    } catch (err) {
        console.log(err)
        return res.status(500).json({error:err,success:false})
    }
}
exports.getFixturesLinkRedisValue=function(req,res,next){
    try {
    client.get(`fixture-id/${req.params.id}`,(err,result)=>{

    if(result){
        const resultJSON = JSON.parse(result);
        return res.status(200).json({link:resultJSON.link,success:true,source:"redis"})
    }
    else{
        next()
    }
        })
    } catch (error) {
        console.log(error)
        return next(error)
    }
}

exports.setFixturesLinkRedisValue=(req,res,next)=>{
    try {
        client.setex(`fixture-id/${req.params.id}`, 120, JSON.stringify({link:req.body.redis_value}));
        return res.status(200).json({source:"api",link:req.body.redis_value,success:true})
    } catch (err) {
        console.log(err)
        return res.status(500).json({error:err,success:false})
    }
}


