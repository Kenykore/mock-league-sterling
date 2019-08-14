
var cons=encodeURIComponent(process.env.DB_PASSWORD)
var url=`mongodb+srv://keny:${cons}@comes-africa-bfopo.gcp.mongodb.net/sterling?retryWrites=true&w=majority`
var testurl=`mongodb+srv://keny:${cons}@comes-africa-bfopo.gcp.mongodb.net/test?retryWrites=true&w=majority`
module.exports={
    'url':url,
    "testurl":testurl
}