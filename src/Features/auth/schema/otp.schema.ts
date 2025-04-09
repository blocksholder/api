const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const otpSchema = new Schema({
    email: { type: String, required: true},
    otp: { type: String, required: true },
    status: {
        type: String,
        enum : ['ACTIVE','DEACTIVE'],
        default: 'ACTIVE',
    },
},  {timestamps: true})

const OtpModel = mongoose.model('Otp', otpSchema);

export default OtpModel