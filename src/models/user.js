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
        trim: true,
        index: true
    },
    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
    },
     provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    picture: {
        type: String,
    },
     role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
      index: true,
    }
},{
    timestamps: true
})

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({_id: user._id}, process.env.SECRET_KEY)
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