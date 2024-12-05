// models/profile.js

const mongoose = require('mongoose');

// Profile Schema
const profileSchema = new mongoose.Schema({
    image: { type: String, required: true },
    storename: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
});

// Export the Profile Model
module.exports = mongoose.model("Profile", profileSchema);
