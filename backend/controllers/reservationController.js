// backend/controllers/reservationController.js
import Reservation from '../models/reservationModel.js';

export const createReservation = async (req, res) => {
  try {
    const { date, time, guests } = req.body;
    console.log("Incoming reservation:", req.body); // 🔹 Debug

    const newReservation = await Reservation.create({ date, time, guests });

    res.status(201).json({ success: true, data: newReservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
