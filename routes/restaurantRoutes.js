import express from "express";
import {
  addRestaurant,
  deleteRestaurant,
  updateRestaurant,
  getAllRestaurants,
} from "../controllers/restaurantController.js";
import { isAuthorized } from "../middleware/auth.js";

const router = express.Router();

// Route to add a restaurant (restricted to admins)
router.post("/add", isAuthorized, addRestaurant);
// Route to delete a restaurant (restricted to admins)
router.delete("/delete/:id", isAuthorized, deleteRestaurant);
// Route to update a restaurant (restricted to admins)
router.put("/update/:id", isAuthorized, updateRestaurant);
//any one can fetch
router.get("/", getAllRestaurants);

export default router;
