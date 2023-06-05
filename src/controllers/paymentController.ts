import { Request, Response } from 'express';
import stripe from 'stripe';
import { dbConnect } from '../db/index.js';
import { ObjectId } from 'mongodb';

const stripeInstance = new stripe('sk_test_51NDsFIAtBcpHWb8jWy3pXohalapfOpnhc5xbl75jpcZChSt3Til8iFbmnPwgNP6zzSIcP7JbdYbZCXdiZTjq9o8300DISaFJ8K', {
  apiVersion: '2022-11-15',
});

export const makePayment = () => {
  return async (req: Request, res: Response) => {
    try {
      const { amount, token, orderId } = req.body;

      const customer = await stripeInstance.customers.create({
        source: token.id,
        name: token.card.name,
      });

      const charge = await stripeInstance.charges.create({
        amount: parseFloat(amount) * 100,
        description: `Payment for USD ${amount}`,
        currency: 'USD',
        customer: customer.id,
      });

      const db = await dbConnect();

      const updateResult = await db?.orders.updateOne(
        { _id: new ObjectId(orderId) },
        { $set: { isPaid: true } }
      );

      if (!updateResult) {
        console.log('Failed to update the order');
        const errorResponse = { error: 'Failed to update the order' };
        res.status(400).json(errorResponse);
        return;
      }
    
      res.status(200).json({ success: true, charge });
    } catch (error) {
      console.error('Error processing payment:', error);
      res.status(500).json({ success: false, error: 'Payment processing failed' });
    }
  };
};
