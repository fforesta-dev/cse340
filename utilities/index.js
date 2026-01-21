const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
                + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + 'details"><img src="' + vehicle.inv_thumbnail
                + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
                + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
                + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* **************************************
* Build the vehicle detail view HTML
* ************************************ */
Util.buildVehicleDetailHTML = async function (vehicle) {
    let detailHTML
    if (vehicle) {
        detailHTML = '<div class="vehicle-detail">'

        // Image (left column)
        detailHTML += '<div class="vehicle-image">'
        detailHTML += '<img src="' + vehicle.inv_image
            + '" alt="' + vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model
            + '" />'
        detailHTML += '</div>'

        // Info (right column)
        detailHTML += '<div class="vehicle-info">'
        detailHTML += '<h2>' + vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h2>'
        detailHTML += '<p class="vehicle-price">Price: <span class="price-value">$'
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span></p>'

        detailHTML += '<div class="vehicle-specs">'
        detailHTML += '<p><strong>Year:</strong> ' + vehicle.inv_year + '</p>'
        detailHTML += '<p><strong>Make:</strong> ' + vehicle.inv_make + '</p>'
        detailHTML += '<p><strong>Model:</strong> ' + vehicle.inv_model + '</p>'
        detailHTML += '<p><strong>Mileage:</strong> ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + ' miles</p>'
        detailHTML += '<p><strong>Color:</strong> ' + vehicle.inv_color + '</p>'
        detailHTML += '<p><strong>Classification:</strong> ' + vehicle.classification_name + '</p>'
        detailHTML += '</div>' // end vehicle-specs
        detailHTML += '</div>' // end vehicle-info

        // Description (moves under the image on desktop grid)
        detailHTML += '<div class="vehicle-description">'
        detailHTML += '<h3>Description</h3>'
        detailHTML += '<p>' + vehicle.inv_description + '</p>'
        detailHTML += '</div>'

        detailHTML += '</div>' // end vehicle-detail
    } else {
        detailHTML = '<p class="notice">Sorry, no matching vehicle could be found.</p>'
    }
    return detailHTML
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util