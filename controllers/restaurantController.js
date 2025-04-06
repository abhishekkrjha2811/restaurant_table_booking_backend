import Restaurant from "../models/Restaurant.js";

export const addRestaurant = async (req, res) => {
    try {
        const { name, location, cuisine, capacity } = req.body;

        // Ensure the userId and role are available from the middleware
        const userId = req.user?.id;
        const userRole = req.user?.role;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User ID not found",
            });
        }

        // Restrict access to admins only
        if (userRole !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Only admins can add restaurants",
            });
        }

        // Create a new restaurant
        const restaurant = await Restaurant.create({
            name,
            location,
            cuisine,
            capacity,
            postedBy: userId, // Set the postedBy field to the logged-in user's ID
        });

        res.status(201).json({
            success: true,
            message: "Restaurant added successfully",
            data: restaurant,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, location, cuisine, capacity } = req.body;

        // Ensure the userId is available from the middleware
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User ID not found",
            });
        }

        // Find the restaurant and ensure it belongs to the logged-in user
        const restaurant = await Restaurant.findOne({ _id: id, postedBy: userId });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found or unauthorized",
            });
        }

        // Update the restaurant details
        restaurant.name = name || restaurant.name;
        restaurant.location = location || restaurant.location;
        restaurant.cuisine = cuisine || restaurant.cuisine;
        restaurant.capacity = capacity || restaurant.capacity;

        await restaurant.save();

        res.status(200).json({
            success: true,
            message: "Restaurant updated successfully",
            data: restaurant,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteRestaurant = async (req, res) => {
    try {
        const { id } = req.params;

        // Ensure the userId is available from the middleware
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User ID not found",
            });
        }

        // Find the restaurant and ensure it belongs to the logged-in user
        const restaurant = await Restaurant.findOneAndDelete({ _id: id, postedBy: userId });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found or unauthorized",
            });
        }

        res.status(200).json({
            success: true,
            message: "Restaurant deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
