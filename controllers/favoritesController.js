const favoritesModel = require("../models/favorites-model");
const inventoryModel = require("../models/inventory-model");
const utilities = require("../utilities/");

/* ***************************
 *  Build favorites view
 * ************************** */
async function buildFavorites(req, res, next) {
    try {
        let nav = await utilities.getNav();
        const account_id = res.locals.accountData.account_id;

        // Get all favorites for the logged-in user
        const favorites = await favoritesModel.getFavoritesByAccount(account_id);

        // Build the favorites grid HTML
        let favoritesGrid = "";
        if (favorites.length > 0) {
            favoritesGrid = await buildFavoritesGrid(favorites);
        } else {
            favoritesGrid = '<p class="no-favorites">You have no favorite vehicles yet. Browse our inventory to add some!</p>';
        }

        res.render("inventory/favorites", {
            title: "My Favorites",
            nav,
            favoritesGrid,
            errors: null,
        });
    } catch (error) {
        console.error("buildFavorites error: " + error);
        req.flash("error", "Unable to load favorites. Please try again.");
        res.redirect("/account/");
    }
}

/* ***************************
 *  Build favorites grid HTML
 * ************************** */
async function buildFavoritesGrid(favorites) {
    let grid = '<ul id="favorites-display">';
    favorites.forEach(vehicle => {
        grid += '<li class="favorite-item">';
        grid += `<a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">`;
        grid += `<img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors">`;
        grid += '</a>';
        grid += '<div class="namePrice">';
        grid += '<hr>';
        grid += '<h2>';
        grid += `<a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">`;
        grid += `${vehicle.inv_make} ${vehicle.inv_model}`;
        grid += '</a>';
        grid += '</h2>';
        grid += `<span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>`;
        grid += '</div>';
        grid += `<p class="favorite-date">Added: ${new Date(vehicle.date_added).toLocaleDateString()}</p>`;
        grid += `<button class="remove-favorite-btn" data-inv-id="${vehicle.inv_id}" onclick="removeFavorite(${vehicle.inv_id})">`;
        grid += '❌ Remove</button>';
        grid += '</li>';
    });
    grid += '</ul>';
    return grid;
}

/* ***************************
 *  Toggle favorite (add or remove)
 *  Returns JSON response for AJAX
 * ************************** */
async function toggleFavorite(req, res, next) {
    try {
        const { inv_id } = req.body;
        const account_id = res.locals.accountData.account_id;

        // Validate inputs
        if (!inv_id || !account_id) {
            return res.status(400).json({
                success: false,
                message: "Missing required information."
            });
        }

        // Check if vehicle exists
        const vehicle = await inventoryModel.getInventoryByInvId(inv_id);
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found."
            });
        }

        // Check if already a favorite
        const isFavorite = await favoritesModel.checkIfFavorite(account_id, inv_id);

        let result;
        let action;

        if (isFavorite) {
            // Remove from favorites
            result = await favoritesModel.removeFavorite(account_id, inv_id);
            action = "removed";
        } else {
            // Add to favorites
            result = await favoritesModel.addFavorite(account_id, inv_id);
            action = "added";
        }

        if (result) {
            return res.json({
                success: true,
                action: action,
                message: action === "added" ? "Added to favorites!" : "Removed from favorites."
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "Unable to update favorites. Please try again."
            });
        }

    } catch (error) {
        console.error("toggleFavorite error: " + error);
        return res.status(500).json({
            success: false,
            message: "An error occurred. Please try again."
        });
    }
}

module.exports = {
    buildFavorites,
    toggleFavorite,
    buildFavoritesGrid
};
