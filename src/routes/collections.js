const express = require("express")
const collectionRouter = express.Router();
const Collection = require("../models/collection");
const Product = require("../models/Products");
const Order = require("../models/order");
const { userAuth } = require("../middlewares/auth");
const {uploadCollectionImages} = require("../utils/upload")

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


collectionRouter.post(
  "/admin/addcollection",
  uploadCollectionImages.single("image"),
  async (req, res) => {
    try {
      const { name, slug, description } = req.body;

      const imagePath = req.file
        ? "/uploads/collection_cover/" + req.file.filename
        : null;

      const newCollection = await Collection.create({
        name,
        slug,
        description,
        image: imagePath,
      });

      res.status(201).json({
        success: true,
        message: "Collection added successfully",
        data: newCollection,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error adding collection",
        error: err.message,
      });
    }
  }
);

module.exports = collectionRouter;