import express from "express";
import { createReservation,getAllReservations ,cancelReservation,getUserReservations} from "../controllers/ReservationController.js";
import { isAuthorized } from "../middleware/auth.js";

const router = express.Router();

// Route to create a reservation
router.post("/create", isAuthorized, createReservation);
router.get("/", isAuthorized, getAllReservations); //only admin
router.get("/user", isAuthorized, getUserReservations); //only the user who booked the seat
router.delete("/cancel/:reservation_id", isAuthorized, cancelReservation);


export default router;
