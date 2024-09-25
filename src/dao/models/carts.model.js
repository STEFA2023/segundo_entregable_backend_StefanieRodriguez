import mongoose from "mongoose";

mongoose.pluralize(null);

const collection = 'carts';

const schema = new mongoose.Schema({
    _user_id: {type: mongoose.Schema.Types.ObjectId, required:true, ref: 'users'},
    products: {type: [{_id: mongoose.Schema.Types.ObjectId, qty: Number}], required: true}
});

const cartsModel = mongoose.model( collection, schema);

export default cartsModel;
