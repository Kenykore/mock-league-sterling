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

describe('Test the fixtures api', () => {
    beforeAll( async () => {
       mongoDB.connect();
       [admin,user]=await Promise.all([
        helper.Post('/api/auth/register/admin',{email:"kenyadmin@gmail.com",password:"bolu"},null),
       helper.Post('/api/auth/register',{email:"keny@gmail.com",password:"bolu"},null),
         ]);
       
       admin_token=admin.body.token
       admin_api_key=admin.body.apiKey
       user_token=user.body.token
       api_key=user.body.apiKey
       let team_to_create={
        name:"Manchester United",
        short_name:"MUFC",
        logo:""
    }
     team=await helper.Post('/api/team',{team:team_to_create},`Bearer ${admin_api_key}`)
     let team2_to_create={
        name:"Chelsea FC",
        short_name:"CFC",
        logo:""
    }
    team2=await helper.Post('/api/team',{team:team2_to_create},`Bearer ${admin_api_key}`)
    });
    test('It should successfully created a fixture by admin', async () => {   
        let fixture_to_create={
            Home_Team:team.body.team._id,
            Away_Team:team2.body.team._id,
            "start_time":"2019-11-18T16:30:37.583Z"
        }
         fixture=await helper.Post('/api/fixture',{fixtures:fixture_to_create},`Bearer ${admin_api_key}`).expect(201)
         console.log("team",fixture.body)
         expect(fixture.body.fixture).toBeTruthy();
         expect(fixture.body.success).toBeTruthy();
    });
    test('Non-admin should not successfully create a fixture', async () => {
      
        let fixture_to_create={
            Home_Team:team.body.team._id,
            Away_Team:team2.body.team._id,
            "start_time":"2019-11-18T16:30:37.583Z"
        }
      const user_fixture=    await helper.Post('/api/fixture',{fixtures:fixture_to_create},`Bearer ${api_key}`).expect(401)

    });
    test('Admin should  successfully create a fixture link', async () => {
      
        let fixture_to_create={
           fixture_id:fixture.body.fixture.fixture_id
        }
      const admin_fixture_link=  await helper.Post('/api/fixture/link',fixture_to_create,`Bearer ${admin_api_key}`).expect(200)
       expect(admin_fixture_link.body.success).toBeTruthy()
    });
    test('It should successfully get all fixtures by a user', async () => {
       const fixture_get= await helper.Get('/api/fixture',{},user_token).expect(200)    
      expect(fixture_get.body.fixtures).toBeTruthy()
      expect(fixture_get.body.success).toBeTruthy()
      });
    test('It should successfully get a fixture by any query by a user', async () => {
       const fixture_get= await helper.Get('/api/fixture/filter',{"filter":"fixture_id","value":fixture.body.fixture.fixture_id},user_token).expect(200)         
      });
      test('It should successfully get a fixture link  by a user', async () => {
        const fixture_get= await helper.Get(`/api/fixture/${fixture.body.fixture.fixture_id}`,{},user_token).expect(200)         
        expect(fixture_get.body.success).toBeTruthy()
        expect(fixture_get.body.link.length).toBeGreaterThan(5)
    });
      test('Admin should be able to update fixture', async () => {
       const admin_update= await helper.Put('/api/fixture',{update:{match_status:"FT"},fixture_id:fixture.body.fixture.fixture_id},`Bearer ${admin_api_key}`).expect(200)
      });
      test('Non-Admin should not be able to update fixture', async () => {
        const non_admin_update=await helper.Put('/api/fixture',{update:{match_status:"FT"},fixture_id:fixture.body.fixture.fixture_id},`Bearer ${api_key}`).expect(401)
      });
    test('It should throw error with empty request object',async ()=>{
        await helper.Post('/api/fixture',{},`Bearer ${admin_api_key}`).expect(422)
    })
    test('Non-Admin should not delete fixture',async ()=>{
    await helper.Delete('/api/fixture',{fixture_id:fixture.body.fixture.fixture_id},`Bearer ${api_key}`).expect(401)
    })
    test('Admin should be able to delete fixture',async ()=>{
        await helper.Delete('/api/fixture',{fixture_id:fixture.body.fixture.fixture_id},`Bearer ${admin_api_key}`).expect(200)
        })
    afterAll(async (done) => {
        var db=   mongoDB.mongoose.connection
        await Promise.all([db.collection('users').dropIndexes(),db.collection('fixtures').dropIndexes(),db.collection('teams').dropIndexes(),db.dropCollection('users'),db.dropCollection('teams'),db.dropCollection('fixtures')
    ]) 
    redisClient.quit(done)
        mongoDB.disconnect(done);
    });
});
