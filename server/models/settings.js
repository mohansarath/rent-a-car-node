var mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

const settingsSchema = new Schema({
    commission: {
        type: Number,
        required:true
    }
});

const Settings = mongoose.model('settings', settingsSchema);

module.exports = { Settings };