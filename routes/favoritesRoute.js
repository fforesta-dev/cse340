const express = require("express");
const router = new express.Router();
const favoritesController = require("../controllers/favoritesController");
const utilities = require("../utilities");
const { body, validationResult } = require("express-validator");

/* ***************************
 *  Route to display favorites page
 *  Requires user to be logged in
 * ************************** */
router.get(
    "/",
    utilities.checkLogin,
    utilities.handleErrors(favoritesController.buildFavorites)
);

/* ***************************
 *  Route to toggle favorite (add/remove)
 *  Requires user to be logged in
 *  Server-side validation
 * ************************** */
router.post(
    "/toggle",
    utilities.checkLogin,
    // Validation rules
    body("inv_id")
        .trim()
        .notEmpty()
        .withMessage("Vehicle ID is required.")
        .isInt({ min: 1 })
        .withMessage("Vehicle ID must be a valid positive integer."),
    // Validation check middleware
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Invalid input data.",
                errors: errors.array()
            });
        }
        next();
    },
    utilities.handleErrors(favoritesController.toggleFavorite)
);

module.exports = router;
