const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    emailId:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password:{ 
        type: String,
        required: true
    }
},{
    Timestamp: true
})

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({_id: user._id}, "NoorEChandani")
    return token
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password
    const comparePassword = await bcrypt.compare(passwordInputByUser, passwordHash)
    return comparePassword
}

const User = mongoose.model("User", userSchema)

module.exports = User;