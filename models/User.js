const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: '<svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg"><rect id="bg" width="300" height="300" fill="rgb(44,34,65)" /><path d="m 150 679 Q 55 245 -379 150 Q 55 55 150 -379 Q 245 55 679 150 Q 245 245 150 679 z" fill="rgb(62,136,142)" /><path d="m 150 525 Q 119 181 -225 150 Q 119 119 150 -225 Q 181 119 525 150 Q 181 181 150 525 z" fill="rgb(193,119,113)" /><path d="m 150 166 Q 137 163 134 150 Q 137 137 150 134 Q 163 137 166 150 Q 163 163 150 166 z" fill="rgb(211,221,190)" /></svg>'
    },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);