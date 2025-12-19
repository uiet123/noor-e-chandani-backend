const express = require("express");
const productRouter = express.Router();
const Product = require("../models/Products");
const Collection = require("../models/collection");
const { uploadProductImages } = require("../utils/upload");

productRouter.get("/products", async (req, res) => {
  try {
    const products = await Product.find().populate(
      "collection",
      "name slug image"
    ).populate("reviews", "rating comment images");
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

productRouter.get("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate(
      "collection",
      "name slug image"
    );
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    return res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

productRouter.post(
  "/admin/addproduct",
  uploadProductImages.array("image", 10),
  async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        actualPrice,
        materialUsed,
        fragranceType,
        scentName,
        burnTime,
        weight,
        stock,
        collection,
      } = req.body;

      const images = req.files.map(
        (file) => "/uploads/products/" + file.filename
      );

      const newProduct = await Product.create({
        name,
        description,
        price,
        actualPrice,
        materialUsed,
        fragranceType,
        scentName,
        burnTime,
        weight,
        stock,
        collection,
        image: images,
      });

      res.status(201).json({
        success: true,
        message: "Product added successfully",
        data: newProduct,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: err.message,
      });
    }
  }
);

productRouter.post("/admin/deleteProduct", async(req, res) => {
    try{
        const { id } = req.body;
        await Product.findByIdAndDelete(id)
        res.json({message: id + " is deleted"})

    }catch(err){
        res.json({success: false, err: err.message })
        
    }
})

module.exports = productRouter;
