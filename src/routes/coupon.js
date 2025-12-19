const express = require('express');
const couponRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const Order = require('../models/order');

couponRouter.post('/apply-coupon', userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { couponCode, cartTotal } = req.body;
      if (!couponCode) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
    }
    const orderCount = await Order.countDocuments({ userId });
      if (orderCount > 0) {
      return res.status(400).json({
        success: false,
        message: "This coupon is only valid for your first order!",
      });
    }

      if (couponCode !== "NOOR10") {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon code",
      });
    }

     const discount = (cartTotal * 10) / 100;
    const finalAmount = cartTotal - discount;

      res.json({
      success: true,
      message: "10% discount applied successfully!",
      discount,
      finalAmount,
    });
  } catch (err) {
    res.status(500).json({success: false, message: err.message});
  }
})

module.exports = couponRouter;