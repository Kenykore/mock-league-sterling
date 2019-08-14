var mongoose= require('mongoose')
var dbConfig= require('../config/database')
module.exports = {
    mongoose,
    connect: () => {
        mongoose.Promise = Promise;
        mongoose.connect(dbConfig.testurl);
    },
    disconnect: (done) => {
        mongoose.disconnect(done);
    },
};