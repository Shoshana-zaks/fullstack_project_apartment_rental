import mongoose from "mongoose";

const citySchema = mongoose.Schema({
    name: {
        type: String
    },
    apartments: [{
        type: mongoose.Types.ObjectId,
        ref: 'Apartment'
    }],
    // require: true
})

export default mongoose.model('City', citySchema)