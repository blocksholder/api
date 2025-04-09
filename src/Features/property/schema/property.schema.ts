const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const ImageSchema = new mongoose.Schema({
    url: { type: String, required: true }
});

const DocumentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    path: { type: String, required: true },
    date_time: { type: Date, required: true }
});

const KeyMetricSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: String, required: true },
    description: { type: String, required: true }
});

const LocationSchema = new mongoose.Schema({
    address: { type: String, required: true },
    location: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    notes: { type: String },
    country: { type: String, required: true }
});

const PropertyDetailsSchema = new mongoose.Schema({
    current_state: { type: String, required: true },
    bath: { type: Number, required: true },
    bed: { type: Number, required: true },
    type: { type: String, required: true },
});

const PropertySchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin", 
        required: false,
    },
    images: [ImageSchema],
    video: { type: String },
    title: { type: String },
    type: { type: String, required: true },
    location: LocationSchema,
    documents: [DocumentSchema],
    project_cost: { type: Number, required: true },
    current_investors: { type: Number, required: true },
    total_bloks: { type: Number, required: true },
    available_bloks: { type: Number, required: true },
    blok_cost: { type: Number, required: true },
    property_details: PropertyDetailsSchema,
    key_metrics: [KeyMetricSchema],
    total_investors: { type: Number, required: true },
    yearly_investment_return: { type: Number, required: true },
    projected_net_yield: { type: Number, required: true },
    return_on_quality: { type: Number, required: true },
    appreciation_rate: { type: Number, required: true },
    currency: { type: String, required: true },
    description: { type: String, required: true },
    status: {
        type: String,
        enum : ['ACTIVE','INACTIVE','DELETED'],
        default: 'ACTIVE',
    },
},  {timestamps: true});


const Property = mongoose.model('Property', PropertySchema);

export default Property

       