const StockAdjustment = require('../models/StockAdjustment');
const Product = require('../models/Product');

const adjustStock = async (adjustmentData) => {
    const session = await StockAdjustment.startSession();
    session.startTransaction();
    try {
        const adjustment = new StockAdjustment(adjustmentData);
        await adjustment.save({ session });

        const product = await Product.findById(adjustmentData.product);
        if (!product) throw new Error('Product not found');

        let newStock = product.stock;
        if (adjustmentData.type === 'add') {
            newStock += adjustmentData.quantity;
        } else if (adjustmentData.type === 'remove') {
            newStock -= adjustmentData.quantity;
        } else if (adjustmentData.type === 'set') {
            newStock = adjustmentData.quantity;
        }

        if (newStock < 0) throw new Error('Stock cannot be negative');

        await Product.findByIdAndUpdate(
            adjustmentData.product,
            { stock: newStock },
            { session }
        );

        await session.commitTransaction();
        return adjustment;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

const getAdjustments = async () => {
    return await StockAdjustment.find().populate('product', 'name barcode').sort({ date: -1 });
};

module.exports = {
    adjustStock,
    getAdjustments,
};
