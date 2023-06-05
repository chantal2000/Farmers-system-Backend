import express from "express";
import bodyParser from 'body-parser';
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import cors from "cors";
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/v1', orderRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', paymentRoutes);
export default app;
//# sourceMappingURL=app.js.map