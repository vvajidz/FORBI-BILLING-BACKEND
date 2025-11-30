const Purchase = require('../models/Purchase');
const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

const createPurchase = async (purchaseData) => {
    const session = await Purchase.startSession();
    session.startTransaction();
    try {
        const purchase = new Purchase(purchaseData);
        await purchase.save({ session });

        // Update product stock and cost price
        for (const item of purchase.items) {
            // Update stock
            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: { stock: item.quantity },
                    // Optional: Update cost price to latest purchase price? 
                    // For now, let's keep it simple or maybe update it.
                    // $set: { costPrice: item.costPrice } 
                },
                { session }
            );
        }

        // Update supplier stats
        if (purchase.status === 'completed') {
            await Supplier.findByIdAndUpdate(
                purchase.supplier,
                {
                    $inc: {
                        totalPurchased: purchase.totalAmount,
                        // Assuming for now it's paid or we track outstanding separately.
                        // If we want to track outstanding, we need payment info.
                        // For simplicity, let's assume it adds to outstanding until paid.
                        outstanding: purchase.totalAmount
                    }
                },
                { session }
            );
        }

        await session.commitTransaction();
        return purchase;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

const getAllPurchases = async () => {
    return await Purchase.find()
        .populate('supplier', 'name')
        .populate('items.product', 'name barcode')
        .sort({ date: -1 });
};

const getPurchaseById = async (id) => {
    return await Purchase.findById(id)
        .populate('supplier')
        .populate('items.product');
};

const deletePurchase = async (id) => {
    const session = await Purchase.startSession();
    session.startTransaction();
    try {
        const purchase = await Purchase.findById(id);
        if (!purchase) throw new Error('Purchase not found');

        // Revert product stock
        for (const item of purchase.items) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: -item.quantity } },
                { session }
            );
        }

        // Revert supplier stats
        if (purchase.status === 'completed') {
            await Supplier.findByIdAndUpdate(
                purchase.supplier,
                {
                    $inc: {
                        totalPurchased: -purchase.totalAmount,
                        outstanding: -purchase.totalAmount
                    }
                },
                { session }
            );
        }

        await Purchase.findByIdAndDelete(id, { session });
        await session.commitTransaction();
        return { message: 'Purchase deleted successfully' };
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

module.exports = {
    createPurchase,
    getAllPurchases,
    getPurchaseById,
    deletePurchase,
};
