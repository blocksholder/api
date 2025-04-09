const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const userSchema = new Schema({
    email: { type: String, required: true, unique: true, index: true},
    role: { type: String, default: 'USER' },
    verified: {type: Boolean, default: false},
    firstname: {type: String, default: null},
    lastname: { type: String, default: null },
    country: {type: String, default: null},
    phoneNumber: {type: String, default: null},
    investmentNews: { type: Boolean, default: true },
    marketNews: {type: Boolean, default: true},
    marketActivity: {type: Boolean, default: true},
    image: {type: String, default: null},
    otp: { type: String, required: true },
    documents: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
    referralCode: {type: String, default: null},
    referredUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }], // One-to-Many (Users referred)
    referredBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    status: {
        type: String,
        enum : ['ACTIVE','DEACTIVE'],
        default: 'ACTIVE',
    },
},  {timestamps: true})

const User = mongoose.model('User', userSchema);

export default User