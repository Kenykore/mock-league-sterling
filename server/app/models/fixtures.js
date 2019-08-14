Schema=require('mongoose').Schema
var ObjectId=Schema.Types.ObjectId
var mongoose=require('mongoose');
var FixturesSchema= new mongoose.Schema({
    Home_Team:{
        type:ObjectId,
        required:true,
        ref:"Team"
    },
    Away_Team:{
        type:ObjectId,
        required:true,
        ref:"Team"
    },
    match_status:{
        type:String,
        enum:["FT","NS","HT","L","ET"]
    },
    Home_Score:{
        type:Number,
        default:0
    },
    Away_Score:{
        type:Number,
        default:0
    },
    start_time:{
        type:Date,

    },
    fixture_id:{
        type:String,
        required:true,
        unique:true
     }
    }, {
    timestamps: true
});

module.exports = mongoose.model('Fixture', FixturesSchema);        