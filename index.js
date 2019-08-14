var port= process.env.PORT || 3100 ;
const app=require('./server/app/app')
var mongoose= require('mongoose')
var databaseConfig = require('./server/config/database');
mongoose.connect(databaseConfig.url)
var db= mongoose.connection
db.on('error',console.error.bind(console,'connection error'))
db.once('open',(()=>{
    console.log("connected to db")
}))

app.listen(port,(()=>{
  console.log('new server working',port)
}));

// module.exports = {
//     api
//   }


