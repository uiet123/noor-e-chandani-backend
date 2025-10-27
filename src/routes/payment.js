const express = require("express");
const paymentRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const Order = require("../models/order");
const {validateWebhookSignature} = require("razorpay/dist/utils/razorpay-utils");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { items, shippingAddress, subtotal, shippingCharge, totalAmount } =
      req.body;

          if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart items are required" });
    }
    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ error: "Invalid total amount" });
    }

    const newOrder = new Order({
      userId: req.user._id,
      items,
      shippingAddress,
      subtotal,
      shippingCharge,
      totalAmount,
      paymentStatus: "created",
      orderStatus: "pending",
    });

    const savedOrder = await newOrder.save();

    const order = await razorpayInstance.orders.create({
      amount: totalAmount * 100, 
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        userId: req.user._id.toString(),
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        emailId: req.user.emailId
      },
    });

    savedOrder.razorpayOrderId = order.id;
await savedOrder.save();


    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});

paymentRouter.post("/payment/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    try{
        const webhookSignature = req.get("X-Razorpay-Signature") || req.get("x-razorpay-signature");

         if(!webhookSignature) {
             console.log("❌ Missing X-Razorpay-Signature header");
            return res.status(400).json({msg: "Signature missing"})
        }

        const bodyString = req.body.toString("utf8");

        const isWebhookValid =  validateWebhookSignature(bodyString, webhookSignature , process.env.RAZORPAY_WEBHOOK_SECRET);

        if(!isWebhookValid) {
             console.log("❌ Invalid signature received from Razorpay");
        return res.status(400).json({ msg: "Invalid signature" });
        }

              // ✅ Ab JSON parse karo after signature verify
      const payload = JSON.parse(bodyString);
      const event = payload.event;
      const paymentEntity = payload.payload.payment.entity;

      console.log("✅ Webhook received:", event, paymentEntity.id);

      // Update payment status
      const payment = await Payment.findOne({
        orderId: paymentEntity.order_id,
      });

      if (payment) {
        payment.status = paymentEntity.status;
        payment.paymentId = paymentEntity.id;
        await payment.save();
      }

      // Update order status as well
      await Order.findOneAndUpdate(
        { razorpayOrderId: paymentEntity.order_id },
        {
          paymentStatus: paymentEntity.status,
          orderStatus:
            event === "payment.captured"
              ? "processing"
              : event === "payment.failed"
              ? "failed"
              : "pending",
        }
      );

      console.log(`✅ Order updated for ${paymentEntity.order_id}`);

      return res.status(200).json({ msg: "Webhook handled successfully" });
    }
    catch(err) {
        res.status(400).send(`Error: ${err.message}`)
    }
})

module.exports = paymentRouter;
