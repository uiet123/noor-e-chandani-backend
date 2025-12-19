const mongoose = require("mongoose");

const customCandleSchema = new mongoose.Schema(
  {
    isCustom: {
      type: Boolean,
      default: false,
      required: true,
    },
    glassType: {
      type: String,
      default: "",
    },
    waxType: {
      type: String,
      default: "",
    },
    messageType: {
      type: String, // "preset" | "custom" | "none"
      default: "none",
    },
    messageText: {
      type: String,
      default: "",
    },
    layers: {
      type: String, // "single" | "double"
      default: "single",
    },
    layer1Color: {
      type: String,
      default: "",
    },
    layer2Color: {
      type: String,
      default: "",
    },
    fragrance: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

module.exports = customCandleSchema;
