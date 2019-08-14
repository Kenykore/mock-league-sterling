Schema=require('mongoose').Schema
var ObjectId=Schema.Types.ObjectId
var mongoose=require('mongoose');
var TeamsSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    short_name:{
        type:String
    },
     logo:{
         type:String
     },
     team_id:{
        type:String,
        required:true,
        unique:true
     }
    }, {
    timestamps: true
});

module.exports = mongoose.model('Team', TeamsSchema);        