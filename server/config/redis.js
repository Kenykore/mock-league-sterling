const redis = require('redis');
const client = redis.createClient({
  host:'redis-18481.c17.us-east-1-4.ec2.cloud.redislabs.com',
  port:18481,
  no_ready_check: true,
  auth_pass:'7Ce1D7gE5tnmoXlA5wUAgIQLaginnKwH',
});     

module.exports=client  