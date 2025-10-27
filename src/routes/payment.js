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

paymentRouter.post("/payment/webhook", async (req, res) => {
    try{
        const webhookSignature = req.get("X-Razorpay-Signature")

        const isWebhookValid =  validateWebhookSignature(JSON.stringify(req.body.toString()), webhookSignature , process.env.RAZORPAY_WEBHOOK_SECRET);

        if(!isWebhookValid) {
            return res.status(400).json({msg: "Webhook signature is invalid"})
        }

        const paymentDetails = req.body.payload.payment.entity;
        const payment = await Payment.findOne({orderId: paymentDetails.order_id})

        payment.status = paymentDetails.status
        await payment.save();

       // if(req.body.event === "payment.captured"){

       // }
      //  if(req.body.event === "payment.failed"){
            
      //  }
        return res.status(200).json({msg: "Webhook received successfully"})
    }
    catch(err) {
        res.status(400).send(`Error: ${err.message}`)
    }
})

module.exports = paymentRouter;
