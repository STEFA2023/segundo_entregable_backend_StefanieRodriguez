import mongoose from "mongoose";

mongoose.pluralize(null);

const collection = 'users';

const schema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: {type: String, required: true},
    age: {type: Number, required: true},
    active: {type: Boolean, required: true},
    role: {type: String, enum: ['admin', 'premium', 'user'], default: 'user'}
});

const usersModel = mongoose.model( collection, schema);

export default usersModel;
