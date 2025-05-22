import mongoose from "mongoose";

const advertiserSchema = mongoose.Schema({ 
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: String,
        required: true,
        minLength: 5
    },
    phone: {
        type: String,
        required: true,
        minLength: 9
    },
    phone_other: {
         type: String,
        minLength: 9, 
        required: false, 
        default: "" 
    },
    apartmens: [{
        type: mongoose.Types.ObjectId,
        ref: 'Apartment'
    }],
})

const Advertiser = mongoose.model('Advertiser', advertiserSchema); // שים לב לתיקון כאן
export default Advertiser;
