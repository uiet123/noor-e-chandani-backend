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
          required: true,
        },
        name: String,
        price: Number,
        quantity: Number,
        image: String,
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

    // Razorpay-related details
    
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
