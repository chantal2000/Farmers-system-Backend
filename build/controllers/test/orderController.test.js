var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import request from 'supertest';
import app from '../../app.js';
describe('(POST) create order', () => {
    it('should create a order successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const order = {
            farmerName: "divin",
            landSize: 0.3,
            fertilizer: "lime",
            fertilizerQuantity: 1,
            seeds: "maize",
            seedsQuantity: 1
        };
        const response = yield request(app).post('/api/v1/orders').send(order);
        expect(response.status).toEqual(201);
    }));
});
//# sourceMappingURL=orderController.test.js.map