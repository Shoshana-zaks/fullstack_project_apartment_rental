import mongoose from "mongoose";

const apartmentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        minlength: 10
    },
    image: {
        type: String
    },
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    cityId: {
        type: mongoose.Types.ObjectId,
        ref: 'City',
        required: true
    },
    address: {
        type: String,
        required: true
    },
    numBed: {
        type: Number,
        required: true
    },
    additives: [{
        type: String
    }],
    price: {
        type: Number,
        required: true
    },
    advertiserId: {
        type: mongoose.Types.ObjectId,
        ref: 'Advertiser',
        required: true
    }
});

const Apartment = mongoose.model('Apartment', apartmentSchema);

export default Apartment;
