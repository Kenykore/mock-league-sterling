var helper= require("./helpers")
var mongoDB= require('./mongoosehelper')
var user=null
var admin=null
var user_token=null
var admin_token=null
var api_key=null
var admin_api_key=null
var db=null
var redisClient= require("../config/redis")
describe('Test the user api', () => {
    beforeAll(() => {
       mongoDB.connect();
    });
    test('It should successfully created a user', async () => {
      user= await helper.Post('/api/auth/register',{email:"keny@gmail.com",password:"bolu"},null).expect(201)
      expect(user.body.user.email).toBe("keny@gmail.com");
      expect(user.body.apiKey).toBeTruthy();
      expect(user.body.token).toBeTruthy();
      expect(user.body.success).toBeTruthy();
      user_token=user.body.token
      api_key=user.body.apiKey
     // return
    });
    test('It should not successfully created an existing user', async () => {
        await helper.Post('/api/auth/register',{email:"keny@gmail.com",password:"bolu"},null).expect(422)
       // return
      });
      test('User should be able to login', async () => {
        await helper.Post('/api/auth/login',{email:"keny@gmail.com",password:"bolu"},null).expect(200)
       // return
      });
    test('It should throw error with empty request object',async ()=>{
         user= await helper.Post('/api/auth/register',{}).expect(422)
        expect(user.body.success).toBeFalsy();
    })
    test('Non-Admin should not delete user',async ()=>{
        user= await helper.Delete('/api/auth',{email:"keny@gmail.com"},user_token).expect(403)
        expect(user.body.success).toBeFalsy();
    })
    test('It should successfully created an admin user', async () => {
        admin= await helper.Post('/api/auth/register/admin',{email:"kenyadmin@gmail.com",password:"bolu"},null).expect(201)
        expect(admin.body.user.email).toBe("kenyadmin@gmail.com");
        expect(admin.body.apiKey).toBeTruthy();
        expect(admin.body.token).toBeTruthy();
        expect(admin.body.success).toBeTruthy();
        admin_token=admin.body.token
        admin_api_key=admin.body.apiKey
      });
      test('Admin should be able to delete user',async ()=>{
        admin= await helper.Delete('/api/auth',{email:"keny@gmail.com"},admin_token).expect(200)
        expect(admin.body.success).toBeTruthy();
    })
    afterAll(async (done) => {
        var db=   mongoDB.mongoose.connection
        await db.collection('users').dropIndexes()
         await  db.dropCollection('users')
        mongoDB.disconnect(done);
        redisClient.quit(done)
    });
});

 