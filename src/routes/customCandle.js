const express = require("express");
const customCandleRouter = express.Router();
const calculateCustomCandlePrice = require("../data/customCandlePricing");
const CustomProductsData = require("../data/CustomProductsData")


customCandleRouter.get("/get-custom-candle", (req, res) => {
    try {
    return res.status(200).json({
      success: true,
      message: "Custom candle products fetched successfully",
      data: CustomProductsData,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
})


customCandleRouter.post("/custom-candle", (req, res) => {
  try {
    const {
      productId,
      picture,
      name,          
      glassType,
      waxType,
      messageType,
      messageText,
      layers,
      layer1Color,
      layer2Color,
      fragrance,
      quantity = 1
    } = req.body;

  
    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID missing" });
    }

    if (!glassType || !waxType || !layers) {
      return res.status(400).json({
        success: false,
        message: "Please select all required fields."
      });
    }

    if (productId !== 1 && messageType !== "none") {
      return res.status(400).json({
        success: false,
        message: "Messages are only allowed for Message Candle."
      });
    }

    if (messageType === "custom" && !messageText) {
      return res.status(400).json({
        success: false,
        message: "Custom message cannot be empty."
      });
    }

    if (layers === "double" && (!layer1Color || !layer2Color)) {
      return res.status(400).json({
        success: false,
        message: "Double layer requires both colors."
      });
    }

    let finalFragrance = fragrance;
    if (waxType === "gel-wax") {
      finalFragrance = "";
    }

    const customPrice = calculateCustomCandlePrice({
      productId,
      glassType,
      waxType,
      messageType,
      layers,
      layer1Color,
      layer2Color,
      fragrance: finalFragrance
    });

    const customCandle = {
      productId,
      name: name,
      isCustom: true,
      price: customPrice,
      quantity,
      image: picture,

      customDetails: {
        isCustom: true,
        productId,
        glassType,
        waxType,
        messageType,
        messageText,
        layers,
        layer1Color,
        layer2Color,
        fragrance: finalFragrance,
        customPrice
      }
    };

    return res.json({
      success: true,
      message: "Custom candle generated successfully!",
      data: customCandle
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = customCandleRouter;
