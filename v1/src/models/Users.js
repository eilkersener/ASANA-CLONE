const Mongoose = require('mongoose');
const logger = require('../scripts/logger/Projects');

const UserSchema = new Mongoose.Schema({
    full_name: String,
    password: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    profile_image: String,
},
{timestamps: true, versionKey: false});

UserSchema.post("save", (doc)=>{
    logger.log({
        level:"info",
        message : doc,
    }) 
    // ... kayıt edilmiştir... Loglama...
})
module.exports = Mongoose.model("user", UserSchema);
