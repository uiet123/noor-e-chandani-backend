const mongoose = require("mongoose")

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://princeuiet123_db_user:L2WpnPiw40n1HLC8@noor-e-chandani-cluster.zqq6ckn.mongodb.net/NoorEChandani"
    )
}

module.exports = connectDB