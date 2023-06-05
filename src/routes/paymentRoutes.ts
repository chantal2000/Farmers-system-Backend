import { makePayment } from "../controllers/paymentController.js";
import { Router } from 'express';

const paymentRoutes: Router = Router();

paymentRoutes.post('/payment', makePayment());

export default paymentRoutes;