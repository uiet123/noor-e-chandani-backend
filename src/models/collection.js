const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    slug:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
    },
    image:{
        type: String,
    }
},{
    timestamps: true
})

const Collection = mongoose.model("Collection", collectionSchema)

module.exports = Collection;