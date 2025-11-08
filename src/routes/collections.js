const express = require("express")
const collectionRouter = express.Router();
const Collection = require("../models/collection");
const Product = require("../models/Products");
const Order = require("../models/order");
const { userAuth } = require("../middlewares/auth");

collectionRouter.get("/collections", async (req, res) => {
    try{
        const collections = await Collection.find().sort({name: 1})
        res.json({success: true, data: collections})

    } catch(err) {
        res.status(500).json({success: false, message: err.message})
    }
})

collectionRouter.get("/collections/:slug", async (req, res) => {
    try{
        const slug = req.params.slug;
        const collection = await Collection.findOne({slug})
        if(!collection) {
            return res.status(404).json({success: false, message: "Collection not found"})
        }
        const products = await Product.find({collection: collection._id}).sort({createdAt: -1})
        res.json({success: true, data: {collection, products}})
    } catch(err) {
        res.status(500).json({success: false, message: err.message})
    }
})

collectionRouter.get("/orders", userAuth, async (req, res) => {
    try{
        const user = req.user;
        const order = await Order.find({userId: user._id})
        console.log(order)
        res.json({success: true, data: order})


    }
    catch(err) {
        res.status(500).json({success: false, message: err.message})
    }
})

module.exports = collectionRouter;