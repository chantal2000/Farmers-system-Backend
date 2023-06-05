import { Router } from 'express';
import { createOrder } from '../controllers/orderController.js';
import { getOrders } from '../controllers/orderController.js';
import { getOrder } from '../controllers/orderController.js';
import { deleteOrder } from '../controllers/orderController.js';
import { makeOrderAsPaid } from '../controllers/orderController.js';
import { acceptOrder } from '../controllers/orderController.js';
const orderRoutes = Router();
orderRoutes.post('/orders', createOrder());
orderRoutes.get('/orders', getOrders());
orderRoutes.put('/accept/:orderId', acceptOrder());
orderRoutes.delete('/orders/:orderId', deleteOrder());
orderRoutes.get('/orders/:orderId', getOrder());
orderRoutes.put('/pay/:orderId', makeOrderAsPaid());
export default orderRoutes;
//# sourceMappingURL=orderRoutes.js.map