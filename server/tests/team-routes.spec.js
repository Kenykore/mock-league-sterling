var helper= require("./helpers")
var mongoDB= require('./mongoosehelper')
var redisClient= require("../config/redis")
var user=null
var admin=null
var user_token=null
var admin_token=null
var api_key=null
var admin_api_key=null
var db=null
var team=null
var team2=null
var fixture=null
var admin_logged_in=null
var user_logged_in=null
describe('Test the team api', () => {
    beforeAll( async () => {
       mongoDB.connect();
       [admin,user]=await Promise.all([helper.Post('/api/auth/register/admin',{email:"kenyadmin@gmail.com",password:"bolu"},null),
       helper.Post('/api/auth/register',{email:"keny@gmail.com",password:"bolu"},null)
    ])
       console.log(admin.body,user.body)
       admin_token=admin.body.token
       admin_api_key=admin.body.apiKey
       user_token=user.body.token
       api_key=user.body.apiKey
    });
    test('It should successfully created a team by admin', async () => {   
        let team_to_create={
            name:"Manchester United",
            short_name:"MUFC",
            logo:""
        }
         team=await helper.Post('/api/team',{team:team_to_create},`Bearer ${admin_api_key}`).expect(201)
         console.log("team",team.body)
         expect(team.body.team).toBeTruthy();
         expect(team.body.success).toBeTruthy();
    });
    
    test('Non-admin should not successfully create a team', async () => {
      
        let team_to_create={
            name:"Manchester United",
            short_name:"MUFC",
             logo:""
        }
      const user_team=    await helper.Post('/api/team',{team:team_to_create},`Bearer ${api_key}`).expect(401)

     // return
    });
    test('It should successfully get all teams by a user', async () => {
        const team_get= await helper.Get('/api/team',{},user_token).expect(200)    
       expect(team_get.body.teams).toBeTruthy()
       expect(team_get.body.success).toBeTruthy()
       });
    test('It should successfully get a team by any query by a user', async () => {
        console.log(team.body,"team")
       const user_get= await helper.Get('/api/team/filter',{filter:"team_id",value:team.body.team.team_id},user_token).expect(200)
       const user_get2=await helper.Get('/api/team/filter',{filter:"name",value:team.body.team.name},user_token).expect(200)
         
      });
      test('Admin should be able to update team', async () => {
       const admin_update= await helper.Put('/api/team',{update:{short_name:"MANU"},team_id:team.body.team.team_id},`Bearer ${admin_api_key}`).expect(200)
      });
      test('Non-Admin should not be able to update team', async () => {
        const non_admin_update=await helper.Put('/api/team',{update:{short_name:"MANU"},team_id:team.body.team.team_id},`Bearer ${api_key}`).expect(401)
      });
    test('It should throw error with empty request object',async ()=>{
        await helper.Post('/api/team',{},`Bearer ${admin_api_key}`).expect(422)
    })
    test('Non-Admin should not delete team',async ()=>{
    await helper.Delete('/api/team',{team_id:team.body.team.team_id},`Bearer ${api_key}`).expect(401)
    })
    test('Admin should be able to delete team',async ()=>{
        await helper.Delete('/api/team',{team_id:team.body.team.team_id},`Bearer ${admin_api_key}`).expect(200)
        })
    afterAll(async (done) => {
        var db=   mongoDB.mongoose.connection
        await Promise.all([db.collection('users').dropIndexes(),db.collection('teams').dropIndexes(),db.dropCollection('users'),db.dropCollection('teams')
    ]) 
    redisClient.quit(done)
        mongoDB.disconnect(done);
    });
});
