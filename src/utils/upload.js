const multer = require("multer")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/reviews");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_")
    );
  },
});

const collectionStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/collection_cover");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});



const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/products"); // folder ensure created
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

 const uploadReviewImages = multer({ storage });
 const uploadProductImages = multer({ storage: productStorage})
 const uploadCollectionImages = multer({ storage: collectionStorage });
 module.exports = { uploadReviewImages, uploadProductImages, uploadCollectionImages }

