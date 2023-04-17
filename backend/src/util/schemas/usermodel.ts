import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    uuid: String,
    email: String,
    password: String,
    account: Object,
    friends: Object,
    billing: Object,
    profile: Object,
    connections: Object
});

export default mongoose.model('users', schema);