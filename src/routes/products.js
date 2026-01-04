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

          customizationType,
  fixedColor,
  fixedFragrance,
  availableColors,
  availableFragrances,
      } = req.body;


      // 🧠 Normalize arrays (FormData string issue)
const parsedAvailableColors =
  typeof availableColors === "string"
    ? availableColors.split(",")
    : availableColors || [];

const parsedAvailableFragrances =
  typeof availableFragrances === "string"
    ? availableFragrances.split(",")
    : availableFragrances || [];

// 🔒 VALIDATION RULES
if (customizationType === "ADMIN_DEFINED") {
  if (!fixedColor) {
    return res.status(400).json({
      success: false,
      message: "Fixed color is required for admin defined product",
    });
  }
}

if (customizationType === "USER_DEFINED") {
  if (!parsedAvailableColors || parsedAvailableColors.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Available colors are required for user defined product",
    });
  }
}


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
         customizationType,

  fixedColor:
    customizationType === "ADMIN_DEFINED" ? fixedColor : null,

  fixedFragrance:
    customizationType === "ADMIN_DEFINED" ? fixedFragrance : null,

  availableColors:
    customizationType === "USER_DEFINED" ? parsedAvailableColors : [],

  availableFragrances:
    customizationType === "USER_DEFINED" ? parsedAvailableFragrances : [],
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


productRouter.patch(
  "/adminEdit/updateProduct/:id",
  uploadProductImages.array("image", 10),
  async (req, res) => {
    try {
      const updates = { ...req.body };

// 🧠 HANDLE customization logic
if (updates.customizationType === "ADMIN_DEFINED") {
  updates.availableColors = [];
  updates.availableFragrances = [];
} 

if (updates.customizationType === "USER_DEFINED") {
  updates.fixedColor = "";
  updates.fixedFragrance = "";
}


// 🧹 STRING → ARRAY CONVERSION (from FormData)
if (updates.availableColors && typeof updates.availableColors === "string") {
  updates.availableColors = updates.availableColors
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
}

if (
  updates.availableFragrances &&
  typeof updates.availableFragrances === "string"
) {
  updates.availableFragrances = updates.availableFragrances
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);
}



      if (req.files && req.files.length > 0) {
        updates.image = req.files.map(
          (file) => "/uploads/products/" + file.filename
        );
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true }
      );

      res.json({
        success: true,
        message: "Product updated successfully",
        data: updatedProduct,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Update failed",
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
