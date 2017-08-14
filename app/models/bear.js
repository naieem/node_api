var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BearSchema = new Schema({
    name: Array,
    title: String
});

module.exports = mongoose.model('Bear', BearSchema);