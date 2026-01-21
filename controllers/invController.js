const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ***************************
 *  Build inventory item detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
    const inv_id = req.params.invId
    const data = await invModel.getInventoryByInvId(inv_id)
    const vehicleHTML = await utilities.buildVehicleDetailHTML(data)
    let nav = await utilities.getNav()
    const vehicleName = `${data.inv_year} ${data.inv_make} ${data.inv_model}`
    res.render("./inventory/detail", {
        title: vehicleName,
        nav,
        vehicleHTML,
    })
}

/* ***************************
 *  Intentionally trigger a 500 error for testing
 * ************************** */
invCont.triggerError = async function (req, res, next) {
    // Create an intentional error with status 500
    const error = new Error("This is an intentional 500-type error for testing purposes!")
    error.status = 500
    throw error
}

module.exports = invCont