import express from 'express';
import { createPayment, vnpayReturn, vnpayIPN, createStaticPayment } from '../controllers/paymentController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create_static_payment', authenticate, createStaticPayment);
router.post('/create_payment_url', authenticate, createPayment);
router.get('/vnpay_return', vnpayReturn);
router.get('/vnpay_ipn', vnpayIPN);

export default router;
