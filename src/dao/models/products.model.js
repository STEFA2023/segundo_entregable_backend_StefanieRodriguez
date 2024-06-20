import mongoose from "mongoose";

mongoose.pluralize(null);

const collection = 'products';

const schema = new mongoose.Schema({
    title: { type: String, required: true },
    description: {type: String, required: true},
    price: {type: Number, required: true},
    //thumbnail: {type: Blob , required: true},
    code: {type: Number, required: true},
    stock: {type: Number, required: true}
});

const productsModel = mongoose.model( collection, schema);

export default productsModel;
