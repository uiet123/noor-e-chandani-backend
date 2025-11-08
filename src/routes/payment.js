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
      orderStatus: "Pending",
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

    savedOrder.orderId = order.id;
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

paymentRouter.post("/payment/webhook", async (req, res) => {
    try{
        const webhookSignature = req.get["X-Razorpay-Signature"] || req.get("x-razorpay-signature");

         if(!webhookSignature) {
             console.log("❌ Missing X-Razorpay-Signature header");
            return res.status(400).json({msg: "Signature missing"})
        }

         const raw = req.rawBody;
    if (!raw) {
      console.log("❌ req.rawBody missing — check express.json verify config");
      return res.status(400).json({ msg: "Raw body missing" });
    }

    const bodyString = raw.toString('utf8');

        const isWebhookValid =  validateWebhookSignature(bodyString, webhookSignature , process.env.RAZORPAY_WEBHOOK_SECRET);

        if(!isWebhookValid) {
             console.log("❌ Invalid signature received from Razorpay");
        return res.status(400).json({ msg: "Invalid signature" });
        }

        console.log("signature valid")

        const paymentDetails = req.body.payload.payment.entity;

        const payment = await Payment.findOne({orderId: paymentDetails.order_id})
        const order = await Order.findOne({orderId: paymentDetails.order_id})
        order.paymentStatus = paymentDetails.status
        payment.status = paymentDetails.status
        await order.save()
        await payment.save()

      console.log(`✅ Order updated for ${paymentEntity.order_id}`);

      return res.status(200).json({ msg: "Webhook handled successfully" });
    }
    catch(err) {
        res.status(400).send(`Error: ${err.message}`)
    }
})

paymentRouter.get("/payment/status/:orderId", userAuth, async (req, res) => {
  try{
    const { orderId } = req.params;

    const payment = await Payment.findOne({ orderId});
    const order = await Order.findOne({orderId});
    if(!payment || !order) {
        return  res.status(404).json({msg: "Payment or Order not found"})
    }
    const status = payment.status

    res.json({status})

  }
  catch(err) {
    res.status(400).send(`Error: ${err.message}`)
  }
})

module.exports = paymentRouter;
