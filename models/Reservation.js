import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: [true, "A reservation must be associated with a user"],
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant", // Reference to the Restaurant model
        required: [true, "A reservation must be associated with a restaurant"],
    },
    numberOfGuests: {
        type: Number,
        required: [true, "Please specify the number of guests"],
        min: [1, "Number of guests must be at least 1"],
    },
    reservationDate: {
        type: Date,
        required: [true, "Please specify the reservation date"],
    },
    reservationTime: {
        type: String,
        required: [true, "Please specify the reservation time"],
    },
    specialRequests: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Add a unique index to prevent double bookings
reservationSchema.index(
    { restaurant: 1, reservationDate: 1, reservationTime: 1 },
    { unique: true, message: "This time slot is already booked for the selected restaurant" }
);

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;