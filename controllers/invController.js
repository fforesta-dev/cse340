const invCont = {}
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

/* ***************************
 *  Process add-inventory form
 * ************************** */
invCont.addInventory = async function (req, res, next) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(req.body.classification_id);
    const {
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color
    } = req.body;
    try {
        const result = await invModel.addInventory({
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color
        });
        if (result && result.rowCount > 0) {
            nav = await utilities.getNav();
            req.flash("notice", "New inventory item added successfully!");
            res.status(201).render("./inventory/management", {
                title: "Inventory Management",
                nav
            });
        } else {
            req.flash("notice", "Failed to add inventory item.");
            res.status(501).render("./inventory/add-inventory", {
                title: "Add Inventory",
                nav,
                classificationList,
                errors: null,
                ...req.body
            });
        }
    } catch (error) {
        req.flash("notice", "Error: " + error.message);
        res.status(500).render("./inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            classificationList,
            errors: null,
            ...req.body
        });
    }
}

/* ***************************
 *  Build add-inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    res.render("./inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        errors: null
    });
}

/* ***************************
 *  Process add-classification form
 * ************************** */
invCont.addClassification = async function (req, res, next) {
    let nav = await utilities.getNav();
    const { classification_name } = req.body;
    try {
        // Insert new classification using the model
        const result = await invModel.addClassification(classification_name);
        if (result && result.rowCount > 0) {
            nav = await utilities.getNav(); // Refresh nav to show new classification
            req.flash("notice", "New classification added successfully!");
            res.status(201).render("./inventory/management", {
                title: "Inventory Management",
                nav
            });
        } else {
            req.flash("notice", "Failed to add classification.");
            res.status(501).render("./inventory/add-classification", {
                title: "Add Classification",
                nav,
                errors: null
            });
        }
    } catch (error) {
        req.flash("notice", "Error: " + error.message);
        res.status(500).render("./inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: null
        });
    }
}

/* ***************************
 *  Build add-classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null
    });
}

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("./inventory/management", {
        title: "Inventory Management",
        nav
    });
}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    let className = "Classification";
    if (data && data.length > 0 && data[0].classification_name) {
        className = data[0].classification_name;
    } else {
        // Fetch the classification name directly if no vehicles exist
        const classObj = await invModel.getClassificationById(classification_id);
        if (classObj && classObj.classification_name) {
            className = classObj.classification_name;
        }
    }
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    });
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