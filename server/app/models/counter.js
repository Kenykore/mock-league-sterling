var mongoose=require('mongoose');

var Counter= new mongoose.Schema({

 
    name:{
        type:String
    },
    value:{
        type:Number,
        default:0
    }
    
    
},{
    timestamps:true
}
)
module.exports = mongoose.model('Counter', Counter);