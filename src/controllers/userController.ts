import { Request, Response } from 'express';
import { dbConnect } from '../db/index.js';
import { IUser } from '../models/user.js';
import { ObjectId } from 'mongodb';

export const createUser = () => {
    return async (req: Request, res: Response) => {
      const db = await dbConnect();
      const { firstName, lastName, email, password, role } = req.body;
  
      const newUser: IUser = {
        firstName,
        lastName,
        email,
        password,
        role
      };
  
      const users = await db?.users.insertOne(newUser);
      if (!users) {
        console.log("request failed");
        const errorResponse = { error: 'request failed' };
        res.status(400).json(errorResponse);
        return;
      }
  
      const response = { data: newUser, status: 201 };
      res.status(response.status).json(response);
    };
};

export const login = () => {
  return async (req: Request, res: Response) => {
    const db = await dbConnect();
    const { email, password } = req.body;

    const user = await db?.users.findOne({ email: email });

    if (!user || user.password !== password) {
      const errorResponse = { error: 'Invalid email or password' };
      res.status(401).json(errorResponse);
      return;
    }

    const response = { user, status: 200 };
    res.status(response.status).json(response);
  };
};

  