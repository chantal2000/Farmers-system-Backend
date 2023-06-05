var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { dbConnect } from '../db/index.js';
import { ObjectId } from 'mongodb';
export const createOrder = () => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const db = yield dbConnect();
        const { farmerName, landSize, fertilizer, fertilizerQuantity, seeds, seedsQuantity } = req.body;
        let amountToBePaid = 0;
        const fertilizerCostPerKg = 10;
        const totalFertilizerCost = fertilizerQuantity * fertilizerCostPerKg;
        amountToBePaid += totalFertilizerCost;
        const seedCostPerKg = 2;
        const totalSeedCost = seedsQuantity * seedCostPerKg;
        amountToBePaid += totalSeedCost;
        if (landSize <= 1 && fertilizerQuantity > 3) {
            const errorResponse = { error: 'Fertilizer quantity should not exceed 3 kgs on the land size of 1 acre' };
            res.status(400).json(errorResponse);
            return;
        }
        if (landSize <= 1 && seedsQuantity > 1) {
            const errorResponse = { error: 'Seeds quantity should not exceed 1 kg on the land size of 1 acre' };
            res.status(400).json(errorResponse);
            return;
        }
        const newOrder = {
            farmerName,
            landSize,
            fertilizer,
            fertilizerQuantity,
            seeds,
            seedsQuantity,
            isPaid: false,
            status: 'pending',
            amountToBePaid,
        };
        const orders = yield (db === null || db === void 0 ? void 0 : db.orders.insertOne(newOrder));
        if (!orders) {
            console.log('request failed');
            const errorResponse = { error: 'request failed' };
            res.status(400).json(errorResponse);
            return;
        }
        const response = { data: newOrder, status: 201 };
        res.status(response.status).json(response);
    });
};
export const getOrders = () => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const db = yield dbConnect();
        const orders = yield (db === null || db === void 0 ? void 0 : db.orders.find({}).toArray());
        if (!orders || (yield orders).length === 0) {
            const errorResponse = { error: 'No Orders found' };
            res.status(400).json(errorResponse);
            return;
        }
        const response = { data: orders, status: 200 };
        res.status(response.status).json(response);
    });
};
export const acceptOrder = () => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const db = yield dbConnect();
        const orderId = req.params.orderId;
        const order = yield (db === null || db === void 0 ? void 0 : db.orders.findOne({ _id: new ObjectId(orderId) }));
        if (!order) {
            const errorResponse = { error: 'Order not found.' };
            res.status(404).json(errorResponse);
            return;
        }
        if (!order.isPaid) {
            const errorResponse = { error: 'Order payment is not completed.' };
            res.status(400).json(errorResponse);
            return;
        }
        const updateStatus = 'accepted';
        const updatedOrder = yield (db === null || db === void 0 ? void 0 : db.orders.updateOne({ _id: new ObjectId(orderId), isPaid: true }, { $set: { status: updateStatus } }));
        if (!updatedOrder) {
            console.log("Failed to update order status.");
            const errorResponse = { error: 'Failed to update order status.' };
            res.status(400).json(errorResponse);
            return;
        }
        const response = { data: { order }, status: 200 };
        res.status(response.status).json(response);
    });
};
export const getOrder = () => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const db = yield dbConnect();
        const orderId = req.params.orderId;
        const order = yield (db === null || db === void 0 ? void 0 : db.orders.findOne({ _id: new ObjectId(orderId) }));
        if (!order) {
            const errorResponse = { error: 'Order not found' };
            res.status(400).json(errorResponse);
            return;
        }
        const response = { data: order, status: 200 };
        res.status(response.status).json(response);
    });
};
export const deleteOrder = () => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const db = yield dbConnect();
        const orderId = req.params.orderId;
        const deleteResult = yield (db === null || db === void 0 ? void 0 : db.orders.deleteOne({ _id: new ObjectId(orderId) }));
        if ((deleteResult === null || deleteResult === void 0 ? void 0 : deleteResult.deletedCount) === 0) {
            const errorResponse = { error: 'Order not found' };
            res.status(400).json(errorResponse);
            return;
        }
        const response = { message: 'Order deleted successfully', status: 200 };
        res.status(response.status).json(response);
    });
};
export const makeOrderAsPaid = () => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const db = yield dbConnect();
        const orderId = req.params.orderId;
        const updateResult = yield (db === null || db === void 0 ? void 0 : db.orders.updateOne({ _id: new ObjectId(orderId) }, { $set: { isPaid: true } }));
        if (!updateResult) {
            console.log('Failed to update the order');
            const errorResponse = { error: 'Failed to update the order' };
            res.status(400).json(errorResponse);
            return;
        }
        const response = { success: true, message: 'Order marked as paid' };
        res.status(200).json(response);
    });
};
//# sourceMappingURL=orderController.js.map