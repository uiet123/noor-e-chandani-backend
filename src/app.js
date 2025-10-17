const express = require("express")
const connectDB = require("./config/database")
const cookieParser = require("cookie-parser")
const path = require("path");
const cors = require("cors")
const app = express()


app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

const authRouter = require("./routes/auth")
const collectionRouter = require("./routes/collections")
const productRouter = require("./routes/products")

app.use("/", authRouter)
app.use("/", collectionRouter)
app.use("/", productRouter)

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

