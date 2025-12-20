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

 const uploadReviewImages = multer({storage,
  limits: {
    fileSize: 5 * 1024 * 1024 
  }});
 const uploadProductImages = multer({ storage: productStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 
  }})
 const uploadCollectionImages = multer({ storage: collectionStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 
  } });
 module.exports = { uploadReviewImages, uploadProductImages, uploadCollectionImages }

