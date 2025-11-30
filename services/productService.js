const Product = require('../models/Product');

const createProduct = async (productData) => {
    const product = new Product(productData);
    return await product.save();
};

const getAllProducts = async () => {
    return await Product.find({ deletedAt: null });
};

const getProductById = async (id) => {
    return await Product.findById(id);
};

const updateProduct = async (id, updateData) => {
    return await Product.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteProduct = async (id) => {
    return await Product.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
