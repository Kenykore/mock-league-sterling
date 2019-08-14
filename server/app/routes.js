
 
var AuthenticationController = require('./controllers/authentication')
var TeamController=require("./controllers/team")
var FixturesController= require("./controllers/fixtures")
var RedisController=require("./controllers/redis")
var client=require('../config/redis')
var express = require('express')
var passport = require('passport')
let passportconfig= require("../../server/config/passport")
var requireAuth =  passport.authenticate('jwt', {session: false})
var  requireLogin =  passport.authenticate('local', {session: false})   
var requireBearerAuth= passport.authenticate('bearer',{session:false})
var rateLimiter= require('./controllers/ratelimiter')
 //API Routes 
 module.exports = function(app){
    var apiRoutes = express.Router()
     var   authRoutes = express.Router()
      var  TeamRoutes = express.Router()
      var  FixturesRoutes = express.Router()
     
    // Auth Routes
    apiRoutes.use('/auth', authRoutes);

    authRoutes.post('/register', AuthenticationController.register);
    authRoutes.post('/register/admin', AuthenticationController.RegisterAdmin);
    authRoutes.post('/login',requireLogin,AuthenticationController.login);
    authRoutes.post('/reset/password',AuthenticationController.resetPassword)
    authRoutes.post('/change/password',AuthenticationController.changeUserPassword)
    authRoutes.put('/update',AuthenticationController.UpdateProfile) 
    authRoutes.delete('/',AuthenticationController.roleAuthorization,AuthenticationController.deleteAccount) 
    authRoutes.get('/protected', requireAuth, (req, res) => {
        res.send({ content: 'Success',success:true});
    });

//Team Routes
apiRoutes.use('/team',TeamRoutes)
TeamRoutes.post('/',requireBearerAuth,TeamController.CreateTeam)
TeamRoutes.get('/',rateLimiter,RedisController.RetriveTeamRedisValue,TeamController.GetAllTeams,RedisController.setTeamRedisvalue)
TeamRoutes.get("/filter",rateLimiter,RedisController.getTeamQueryValue,TeamController.FilterTeam,RedisController.setTeamQueryRedisValue)
TeamRoutes.put("/",requireBearerAuth,TeamController.updateTeam)
TeamRoutes.delete("/",requireBearerAuth,TeamController.DeleteTeam)

//Fixtures Routes
apiRoutes.use('/fixture',FixturesRoutes)
FixturesRoutes.post("/",requireBearerAuth,FixturesController.CreateFixtures)
FixturesRoutes.post("/link",requireBearerAuth,FixturesController.GenerateFixturesLink)
FixturesRoutes.get("/",rateLimiter,RedisController.RetriveFixturesRedisValue,FixturesController.GetAllFixtures,RedisController.setFixturesRedisvalue)
FixturesRoutes.get("/filter",rateLimiter,RedisController.getFixturesQueryRedisValue,FixturesController.filterFixtures,RedisController.setFixturesQueryRedisValue)
FixturesRoutes.get("/:id",rateLimiter,RedisController.getFixturesLinkRedisValue,FixturesController.GetFixturesLink,RedisController.setFixturesLinkRedisValue)
FixturesRoutes.put("/",requireBearerAuth,FixturesController.updateFixtures)
FixturesRoutes.delete("/",requireBearerAuth,FixturesController.DeleteFixture)
app.use('/api', apiRoutes);
}