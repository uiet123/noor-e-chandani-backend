const express = require("express");
const mongoose = require("mongoose");
const reviewRouter = express.Router();
const Review = require("../models/review");
const Product = require("../models/Products");
const { userAuth } = require("../middlewares/auth");
const { uploadReviewImages } = require("../utils/upload")
const Order = require("../models/order");

reviewRouter.get(
  "/orders/:orderId/products/:orderItemId/can-review",
  userAuth,
  async (req, res) => {
    try {
      const { orderId, orderItemId } = req.params;

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ success: false, canReview: false });
      }

      if (order.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, canReview: false });
      }

      if (order.orderStatus !== "Delivered") {
        return res.json({ success: true, canReview: false });
      }

      const item = order.items.id(orderItemId);
      if (!item) {
        return res.json({ success: true, canReview: false });
      }

      const already = await Review.findOne({
        orderId,
        orderItemId,
        userId: req.user._id,
      });

      if (already) {
        return res.json({ success: true, canReview: false });
      }

      return res.json({ success: true, canReview: true });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
);




reviewRouter.get("/reviews/summary", async (req, res) => {
  try {
    const summary = await Review.aggregate([
      {
        $group: {
          _id: "$productId",
          avg: { $avg: "$rating" },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          productId: "$_id",
          avg: { $round: ["$avg", 2] },
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json({ success: true, data: summary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


reviewRouter.get("/reviews/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    // validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid productId" });
    }

    // fetch reviews from Review collection, newest first; populate user name if you want
    const reviews = await Review.find({ productId: productId })
      .sort({ createdAt: -1 })
      .populate("userId", "firstName lastName"); // optional: change fields as needed

    // If you prefer an empty array response instead of error when no reviews:
    return res.json({ success: true, data: reviews });

    // If you want to throw if none:
    // if (!reviews.length) return res.status(404).json({ success:false, message: "No reviews yet" });
  } catch (err) {
    console.error("get reviews error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

reviewRouter.post(
  "/orders/:orderId/products/:orderItemId/review",
  userAuth, uploadReviewImages.array("images", 3),
  async (req, res) => {
    try {
      const { orderId, orderItemId } = req.params;
      const { r, comment } = req.body;

      const imagePaths = (req.files || []).map(file => "/uploads/reviews/" + file.filename);

      
      if (
        !mongoose.Types.ObjectId.isValid(orderId) ||
        !mongoose.Types.ObjectId.isValid(orderItemId)
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid id(s)" });
      }

      if (!r || r < 1 || r > 5) {
        return res
          .status(400)
          .json({ success: false, message: "Rating must be 1-5" });
      }

     
      const order = await Order.findById(orderId);
      if (!order)
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });

      if (order.userId.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ success: false, message: "Not your order" });
      }

      if (order.orderStatus !== "Delivered") {
        return res
          .status(400)
          .json({ success: false, message: "Order not delivered" });
      }

      
     const item = order.items.id(orderItemId);
if (!item) {
  return res.status(400).json({
    success: false,
    message: "Order item not found",
  });
}

const productId = item.productId;
    

      
      const already = await Review.findOne({
         orderItemId,
        userId: req.user._id,
      });
      if (already) {
        return res
          .status(400)
          .json({
            success: false,
            message: "You already reviewed this product for this order",
          });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      const review = await Review.create({
        productId,
        orderId,
        orderItemId,
        userId: req.user._id,
        rating: r,
        comment: comment || "",
        images: imagePaths
      });

          await Product.findByIdAndUpdate(productId, {
      $push: { reviews: review._id }
    });

     
      const agg = await Review.aggregate([
        { $match: { productId: new mongoose.Types.ObjectId(productId) } },
        {
          $group: {
            _id: "$productId",
            avgRating: { $avg: "$rating" },
            count: { $sum: 1 },
          },
        },
      ]);

      let avgRating = 0,
        count = 0;
      if (agg && agg.length) {
        avgRating = agg[0].avgRating;
        count = agg[0].count;
      }

      await Product.findByIdAndUpdate(productId, {
        $set: { rating: avgRating, numReviews: count },
      });

      return res.json({ success: true, message: "Review added", review });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

reviewRouter.get("/allreviews", async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "firstName lastName email")
      .populate("productId", "name");
      return res.json({ success: true, data: reviews });
  }
   catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
})

module.exports = reviewRouter;
