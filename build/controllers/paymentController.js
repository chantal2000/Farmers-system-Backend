var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import stripe from 'stripe';
import { dbConnect } from '../db/index.js';
import { ObjectId } from 'mongodb';
const stripeInstance = new stripe('sk_test_51NDsFIAtBcpHWb8jWy3pXohalapfOpnhc5xbl75jpcZChSt3Til8iFbmnPwgNP6zzSIcP7JbdYbZCXdiZTjq9o8300DISaFJ8K', {
    apiVersion: '2022-11-15',
});
export const makePayment = () => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { amount, token, orderId } = req.body;
            const customer = yield stripeInstance.customers.create({
                source: token.id,
                name: token.card.name,
            });
            const charge = yield stripeInstance.charges.create({
                amount: parseFloat(amount) * 100,
                description: `Payment for USD ${amount}`,
                currency: 'USD',
                customer: customer.id,
            });
            const db = yield dbConnect();
            const updateResult = yield (db === null || db === void 0 ? void 0 : db.orders.updateOne({ _id: new ObjectId(orderId) }, { $set: { isPaid: true } }));
            if (!updateResult) {
                console.log('Failed to update the order');
                const errorResponse = { error: 'Failed to update the order' };
                res.status(400).json(errorResponse);
                return;
            }
            res.status(200).json({ success: true, charge });
        }
        catch (error) {
            console.error('Error processing payment:', error);
            res.status(500).json({ success: false, error: 'Payment processing failed' });
        }
    });
};
//# sourceMappingURL=paymentController.js.map