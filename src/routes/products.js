const express = require("express")
const productRouter = express.Router();
const Product = require("../models/Products");
const Collection = require("../models/collection");

productRouter.get("/products", async (req, res) => {
    try{
        const products = await Product.find().populate('collection', 'name slug image');
        res.json({ success: true, data: products });
    }catch(err){
        res.status(500).json({success: false, message: err.message})
    }
})

productRouter.get("/products/:id", async (req, res) => {
    try{
        const productId = req.params.id;
        const product = await Product.findById(productId).populate('collection', 'name slug image');
        if(!product) {
            return res.status(404).json({success: false, message: "Product not found"})
        }
        return res.json({success: true, data: product})
    }catch(err){
        res.status(500).json({success: false, message: err.message})
    }
})

module.exports = productRouter;

