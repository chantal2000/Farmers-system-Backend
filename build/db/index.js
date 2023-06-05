var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
dotenv.config();
const dbUri = process.env.MONGO_URI || 'mongodb+srv://Divin:axel123@cluster0.rwph7ck.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(dbUri);
export function dbConnect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Connecting to database...');
            yield client.connect();
            console.log('Connected to database');
            const db = client.db('farmers');
            const orders = db.collection('farmers-orders');
            const users = db.collection('users');
            return { orders, users };
        }
        catch (error) {
            console.error(error);
            yield client.close();
        }
    });
}
//# sourceMappingURL=index.js.map