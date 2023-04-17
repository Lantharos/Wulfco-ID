import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    id: String,
    user_data: Object,
    device_data: Object,
    session_data: Object,

});

export default mongoose.model('users', schema);