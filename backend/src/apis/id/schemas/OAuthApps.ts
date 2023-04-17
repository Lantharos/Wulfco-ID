import mongoose from "mongoose";

const schema = new mongoose.Schema({
    id: String,
    description: String,
    avatar: Buffer,
    name: String,
    secret: String,
    redirects: Array,
    grants: Array,
    tokens: Array,
    codes: Array
}, { timestamps: true });

export default mongoose.model('oauth', schema);
