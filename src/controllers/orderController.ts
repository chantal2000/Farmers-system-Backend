import { Request, Response } from 'express';
import { dbConnect } from '../db/index.js';
import { IOrder } from '../models/farmersOrder.js';
import { ObjectId } from 'mongodb';

export const createOrder = () => {
  return async (req: Request, res: Response) => {
    const db = await dbConnect();
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

    const newOrder: IOrder = {
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

    const orders = await db?.orders.insertOne(newOrder);
    if (!orders) {
      console.log('request failed');
      const errorResponse = { error: 'request failed' };
      res.status(400).json(errorResponse);
      return;
    }
    const response = { data: newOrder, status: 201 };
    res.status(response.status).json(response);
  };
};


export const getOrders = () => {
  return async (req: Request, res: Response) => {
    const db = await dbConnect();
    const orders = await db?.orders.find({}).toArray();

    if (!orders || (await orders).length === 0) {
        const errorResponse = { error: 'No Orders found' };
        res.status(400).json(errorResponse);
        return;
    }
    const response = { data: orders, status: 200 };
    res.status(response.status).json(response);
  };
};

export const acceptOrder = () => {
  return async (req: Request, res: Response) => {
    const db = await dbConnect();
    const orderId = req.params.orderId;

    const order = await db?.orders.findOne({ _id: new ObjectId(orderId) });
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
    const updatedOrder = await db?.orders.updateOne(
      { _id: new ObjectId(orderId), isPaid: true },
      { $set: { status: updateStatus } }
    );

    if (!updatedOrder) {
      console.log("Failed to update order status.");
      const errorResponse = { error: 'Failed to update order status.' };
      res.status(400).json(errorResponse);
      return;
    }

    const response = { data: { order }, status: 200 };
    res.status(response.status).json(response);
  };
};


export const getOrder = () => {
  return async (req: Request, res: Response) => {
    const db = await dbConnect();
    const orderId = req.params.orderId;

    const order = await db?.orders.findOne({ _id: new ObjectId(orderId) });

    if (!order) {
      const errorResponse = { error: 'Order not found' };
      res.status(400).json(errorResponse);
      return;
    }

    const response = { data: order, status: 200 };
    res.status(response.status).json(response);
  };
};

export const deleteOrder = () => {
  return async (req: Request, res: Response) => {
    const db = await dbConnect();
    const orderId = req.params.orderId;

    const deleteResult = await db?.orders.deleteOne({ _id: new ObjectId(orderId) });

    if (deleteResult?.deletedCount === 0) {
      const errorResponse = { error: 'Order not found' };
      res.status(400).json(errorResponse);
      return;
    }

    const response = { message: 'Order deleted successfully', status: 200 };
    res.status(response.status).json(response);
  };
};


export const makeOrderAsPaid = () => {
  return async (req: Request, res: Response) => {
    const db = await dbConnect();
    const orderId = req.params.orderId;
  
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
  
    const response = { success: true, message: 'Order marked as paid' };
    res.status(200).json(response);
  }
};

