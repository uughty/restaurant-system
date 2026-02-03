import express from 'express';
import { createReservation } from '../controllers/reservationController.js';

const router = express.Router();

router.post('/', createReservation); // <--- make sure this matches frontend

export default router;
