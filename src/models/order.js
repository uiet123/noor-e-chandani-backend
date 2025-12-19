const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: { type: String },
    items: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: false,
        },
        name: String,
        price: Number,
        color: String,
        quantity: Number,
        image: String,

         customDetails: {
          isCustom: { type: Boolean, default: false },

          glassType: { type: String, default: "" },
          waxType: { type: String, default: "" },

          messageType: { type: String, default: "" }, 
          messageText: { type: String, default: "" },

          layers: { type: String, default: "" },
          layer1Color: { type: String, default: "" },
          layer2Color: { type: String, default: "" },

          fragrance: { type: String, default: "" },

          customPrice: { type: Number, default: 0 },
        }
      },
      
    ],

    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: "India" },
    },

    subtotal: { type: Number, required: true },
    shippingCharge: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },

    paymentStatus: {
      type: String,
      enum: ["created", "paid", "failed", "captured"],
      default: "created",
    },

    orderStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
