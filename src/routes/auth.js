const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require("../models/user");
const { userAuth } = require('../middlewares/auth');
const { SignUpValidation } = require('../utils/validation');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { oauth2client } = require('../config/googleConfig');

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
        res.status(401).send(`Error: ${err.message}`)
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
         res.status(401).send(`Error: ${err.message}`)
    }
})

authRouter.post("/admin/login", async (req, res) => {
    try{
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId})
        if(user.role !== 'admin') {
            throw new Error("Access denied. Not an admin user")
        }
        if(!user) {
            throw new Error("Admin user not found")
        }
        const isPassword = await user.validatePassword(password)
        if(isPassword) {
            const token = await user.getJWT()
            res.cookie("token", token)
            res.json({message: "User logged in successfully", data: user})
        } else{
            throw new Error("Invalid credentials")
        }
    }
    catch(err) {
            res.status(401).send(`Error: ${err.message}`)
    }
})

authRouter.get("/googleLogin", async (req, res) => {
    try{
        const {code} = req.query;
        if (!code) return res.status(400).json({ msg: "Missing code" });
        const googleRes = await oauth2client.getToken(code);
        oauth2client.setCredentials(googleRes.tokens);

        const { data }  = await axios.get(
            "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + googleRes.tokens.access_token,
        )
        const {email, name, picture} = data;
        const user = await User.findOne({emailId: email})
        if(!user) {
             user = await User.create({
                firstName: name,
                emailId: email,
                picture: picture,
                provider: "google"
            })
        } else {
      if (user.provider !== "google") user.provider = "google";
      if (!user.picture && picture) user.picture = picture;
      await user.save();
    }
        console.log(user)
           const token = await user.getJWT()
            res.cookie("token", token)
            res.json({message: "User logged in successfully", data: user})

    }catch(err) {
            res.status(401).send(`Error: ${err.message}`)
    }
})

authRouter.get("/auth/me", userAuth ,async (req, res) => {
    try{
        const user = req.user;
        if(!user) {
            throw new Error("User not found")
        }
        res.json({message: "User authenticated", data: user})
    }
    catch(err){
        res.status(401).send(`Error: ${err.message}`)
    }
})

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logged out");
});

module.exports = authRouter;