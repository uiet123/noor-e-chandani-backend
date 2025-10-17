const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require("../models/user");
const { SignUpValidation } = require('../utils/validation');


authRouter.post("/signup", async (req, res) => {
    try{
        SignUpValidation(req);
        const {firstName, lastName, emailId, password} = req.body;
        const passwordHash = await bcrypt.hash(password, 10)
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        })
        const savedUser = await user.save();
        const token = await savedUser.getJWT()
        res.cookie("token", token)
        res.json({message: "User signed up successfully", data: savedUser})
    }
    catch(err) {
        res.status(400).send(`Error: ${err.message}`)
    }
});


authRouter.post("/login", async (req, res) => {
    try{
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId})
        if(!user) {
            throw new Error("User not found")
        }
        const isPassword = await user.validatePassword(password)
        if(isPassword) {
            const token = await user.getJWT()
            res.cookie("token", token)
            res.json({message: "User logged in successfully", data: user})
        } else{
            throw new Error("Invalid credentials")
        }
    }catch(err) {
         res.status(400).send(`Error: ${err.message}`)
    }
})

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logged out");
});

module.exports = authRouter;