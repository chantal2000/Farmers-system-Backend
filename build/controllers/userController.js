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
export const createUser = () => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const db = yield dbConnect();
        const { firstName, lastName, email, password, role } = req.body;
        const newUser = {
            firstName,
            lastName,
            email,
            password,
            role
        };
        const users = yield (db === null || db === void 0 ? void 0 : db.users.insertOne(newUser));
        if (!users) {
            console.log("request failed");
            const errorResponse = { error: 'request failed' };
            res.status(400).json(errorResponse);
            return;
        }
        const response = { data: newUser, status: 201 };
        res.status(response.status).json(response);
    });
};
export const login = () => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const db = yield dbConnect();
        const { email, password } = req.body;
        const user = yield (db === null || db === void 0 ? void 0 : db.users.findOne({ email: email }));
        if (!user || user.password !== password) {
            const errorResponse = { error: 'Invalid email or password' };
            res.status(401).json(errorResponse);
            return;
        }
        const response = { user, status: 200 };
        res.status(response.status).json(response);
    });
};
//# sourceMappingURL=userController.js.map