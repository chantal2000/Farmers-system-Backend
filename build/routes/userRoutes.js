import { Router } from 'express';
import { createUser } from '../controllers/userController.js';
import { login } from '../controllers/userController.js';
const userRoutes = Router();
userRoutes.post('/signup', createUser());
userRoutes.post('/login', login());
export default userRoutes;
//# sourceMappingURL=userRoutes.js.map