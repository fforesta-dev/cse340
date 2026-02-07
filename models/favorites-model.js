const pool = require("../database/");

/* ***************************
 *  Add a vehicle to favorites
 * ************************** */
async function addFavorite(account_id, inv_id) {
    try {
        const sql = `INSERT INTO favorites (account_id, inv_id) 
                     VALUES ($1, $2) 
                     ON CONFLICT (account_id, inv_id) DO NOTHING 
                     RETURNING *`;
        const result = await pool.query(sql, [account_id, inv_id]);
        return result.rowCount > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error("addFavorite error: " + error);
        return null;
    }
}

/* ***************************
 *  Remove a vehicle from favorites
 * ************************** */
async function removeFavorite(account_id, inv_id) {
    try {
        const sql = `DELETE FROM favorites 
                     WHERE account_id = $1 AND inv_id = $2 
                     RETURNING *`;
        const result = await pool.query(sql, [account_id, inv_id]);
        return result.rowCount > 0;
    } catch (error) {
        console.error("removeFavorite error: " + error);
        return false;
    }
}

/* ***************************
 *  Get all favorites for a user with full vehicle details
 * ************************** */
async function getFavoritesByAccount(account_id) {
    try {
        const sql = `SELECT f.favorite_id, f.date_added, 
                            i.inv_id, i.inv_make, i.inv_model, i.inv_year, 
                            i.inv_price, i.inv_thumbnail, i.inv_miles, 
                            c.classification_name
                     FROM favorites f
                     INNER JOIN inventory i ON f.inv_id = i.inv_id
                     INNER JOIN classification c ON i.classification_id = c.classification_id
                     WHERE f.account_id = $1
                     ORDER BY f.date_added DESC`;
        const result = await pool.query(sql, [account_id]);
        return result.rows;
    } catch (error) {
        console.error("getFavoritesByAccount error: " + error);
        return [];
    }
}

/* ***************************
 *  Check if a vehicle is in user's favorites
 * ************************** */
async function checkIfFavorite(account_id, inv_id) {
    try {
        const sql = `SELECT favorite_id 
                     FROM favorites 
                     WHERE account_id = $1 AND inv_id = $2`;
        const result = await pool.query(sql, [account_id, inv_id]);
        return result.rowCount > 0;
    } catch (error) {
        console.error("checkIfFavorite error: " + error);
        return false;
    }
}

/* ***************************
 *  Get count of favorites for a user
 * ************************** */
async function getFavoriteCount(account_id) {
    try {
        const sql = `SELECT COUNT(*) as count 
                     FROM favorites 
                     WHERE account_id = $1`;
        const result = await pool.query(sql, [account_id]);
        return result.rows[0].count;
    } catch (error) {
        console.error("getFavoriteCount error: " + error);
        return 0;
    }
}

module.exports = {
    addFavorite,
    removeFavorite,
    getFavoritesByAccount,
    checkIfFavorite,
    getFavoriteCount
};
