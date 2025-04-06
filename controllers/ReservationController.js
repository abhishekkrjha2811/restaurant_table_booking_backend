import Reservation from "../models/Reservation.js";
import Restaurant from "../models/Restaurant.js";
import { sendEmail } from "../utils/mail.js";

export const createReservation = async (req, res) => {
  try {
    const { restaurant_id, date, time, number_of_people, special_request } = req.body;

    // Ensure the userId is available from the middleware
    const userId = req.user?.id;
    const userEmail = req.user?.email;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found",
      });
    }

    // Check for double booking
    const existingReservation = await Reservation.findOne({
      restaurant: restaurant_id,
      reservationDate: date,
      reservationTime: time,
    });

    if (existingReservation) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked for the selected restaurant",
      });
    }

    // Fetch restaurant details
    const restaurant = await Restaurant.findById(restaurant_id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // Create a new reservation
    const reservation = await Reservation.create({
      user: userId,
      restaurant: restaurant_id,
      reservationDate: date,
      reservationTime: time,
      numberOfGuests: number_of_people,
      specialRequests: special_request,
    });

    // Send confirmation email
    const emailText = `
      Dear ${req.user?.name},

      Your reservation at ${restaurant.name} has been confirmed.
      Details:
      - Date: ${date}
      - Time: ${time}
      - Number of Guests: ${number_of_people}
      - Special Request: ${special_request || "None"}

      Thank you for booking with us!
    `;
    await sendEmail(userEmail, "Reservation Confirmation", emailText);

    res.status(201).json({
      success: true,
      message: "Reservation created successfully",
      data: reservation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelReservation = async (req, res) => {
  try {
    const { reservation_id } = req.params;

    // Ensure the userId is available from the middleware
    const userId = req.user?.id;
    const userEmail = req.user?.email;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found",
      });
    }

    // Find the reservation
    const reservation = await Reservation.findById(reservation_id).populate("restaurant", "name");

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    // Check if the user is authorized to cancel the reservation
    if (reservation.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to cancel this reservation",
      });
    }

    // Delete the reservation
    await Reservation.findByIdAndDelete(reservation_id);

    // Send cancellation email
    const emailText = `
      Dear ${req.user?.name},

      Your reservation at ${reservation.restaurant.name} has been canceled.
      Details:
      - Date: ${reservation.reservationDate.toDateString()}
      - Time: ${reservation.reservationTime}
      - Number of Guests: ${reservation.numberOfGuests}
      - Special Request: ${reservation.specialRequests || "None"}

      We hope to serve you again in the future.

      Thank you!
    `;
    await sendEmail(userEmail, "Reservation Cancellation", emailText);

    res.status(200).json({
      success: true,
      message: "Reservation canceled successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserReservations = async (req, res) => {
  try {
    // Ensure the userId is available from the middleware
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found",
      });
    }

    // Fetch reservations for the logged-in user
    const reservations = await Reservation.find({ user: userId })
      .populate("restaurant", "name location") // Populate restaurant details
      .sort({ reservationDate: 1, reservationTime: 1 }); // Sort by date and time

    if (reservations.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No reservations found",
      });
    }

    res.status(200).json({
      success: true,
      data: reservations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllReservations = async (req, res) => {
  try {
    // Ensure the user is an admin
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only admins can view all reservations",
      });
    }

    // Fetch all reservations
    const reservations = await Reservation.find()
      .populate("user", "name email") // Populate user details
      .populate("restaurant", "name location"); // Populate restaurant details

    res.status(200).json({
      success: true,
      data: reservations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
