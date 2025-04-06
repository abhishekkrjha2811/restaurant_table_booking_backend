import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide the restaurant name"],
            trim: true,
        },
        location: {
            type: String,
            required: [true, "Please provide the restaurant location"],
        },
        cuisine: {
            type: String,
            required: [true, "Please specify the type of cuisine offered"],
        },
        capacity: {
            type: Number,
            required: [true, "Please specify the maximum capacity of the restaurant"],
            min: [1, "Capacity must be at least 1"],
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to the User model
            required: [true, "Please specify the user who posted this restaurant"],
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

export default mongoose.model("Restaurant", restaurantSchema);