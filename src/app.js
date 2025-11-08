require('dotenv').config();
const express = require("express")
const connectDB = require("./config/database")
const cookieParser = require("cookie-parser")
const path = require("path");
const cors = require("cors")


const app = express()


app.use(cors({
    origin:["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}))

app.use(express.json({
  verify: (req, res, buf) => {
    if (buf && buf.length) {
      // store exact raw bytes so webhook route can verify signature
      req.rawBody = Buffer.from(buf);
    }
  }
}));

app.use(cookieParser())
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

const authRouter = require("./routes/auth")
const collectionRouter = require("./routes/collections")
const productRouter = require("./routes/products")
const paymentRouter = require("./routes/payment")
const adminRouter = require("./routes/admin")


app.use("/", authRouter)
app.use("/", collectionRouter)
app.use("/", productRouter)
app.use("/", paymentRouter)
app.use("/", adminRouter)

connectDB()
.then(() => {
    console.log("Database connection established...")
    app.listen(7777, () => {
    console.log("server up")
})
})
.catch((err) => {
    console.error("Database cannot be connected" + err.message)
})

