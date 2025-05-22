import mongoose from "mongoose";

const categorySchema = mongoose.Schema({

    name: {
        type: String
    },

    apartments: [{
        type: mongoose.Types.ObjectId,
        ref: 'Apartment'
    }],
    // require:true

})

export default mongoose.model('Category', categorySchema)