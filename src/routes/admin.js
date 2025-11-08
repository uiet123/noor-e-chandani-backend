const express = require("express");
const adminRouter = express.Router();
const Order = require("../models/order");
const { userAuth } = require("../middlewares/auth");

adminRouter.get("/admin/dashboard", userAuth, async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
});

adminRouter.patch("/admin/:orderId/:status", userAuth, async (req, res) => {
    const { orderId, status } = req.params;
    try{
        const order = await Order.findOne({orderId: orderId});
        if(!order) {
            return res.status(404).json({success: false, message: "Order not found"})
        }
        order.orderStatus = status;
        const updatedOrder = await order.save();
        res.json({ success: true, data: updatedOrder })
    }catch(err) {
        res.status(400).json({ success: false, message: err.message })
    }
})

module.exports = adminRouter;


