const invCont = {}
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
    const invId = parseInt(req.params.invId);
    let nav = await utilities.getNav();
    // Get the inventory item data
    const itemData = await invModel.getInventoryByInvId(invId);
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    res.render("./inventory/delete-confirm", {
        title: "Delete " + itemName,
        nav,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_price: itemData.inv_price
    });
};

/* ***************************
 *  Process inventory deletion
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
    let nav = await utilities.getNav();
    let inv_id = req.body.inv_id;
    if (Array.isArray(inv_id)) inv_id = inv_id[0];
    inv_id = parseInt(inv_id);
    const deleteResult = await invModel.deleteInventory(inv_id);
    if (deleteResult) {
        req.flash("notice", "The inventory item was successfully deleted.");
        res.redirect("/inv/");
    } else {
        req.flash("error", "Sorry, the delete failed.");
        res.redirect(`/inv/delete/${inv_id}`);
    }
};

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
            const classificationSelect = await utilities.buildClassificationList();
            req.flash("notice", "New inventory item added successfully!");
            res.status(201).render("./inventory/management", {
                title: "Inventory Management",
                nav,
                classificationSelect
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
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav();
    let {
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body;
    // Sanitize possible array values
    if (Array.isArray(inv_id)) inv_id = inv_id[0];
    if (Array.isArray(classification_id)) classification_id = classification_id[0];
    // You must implement updateInventory in your model for this to work
    const updateResult = await invModel.updateInventory(
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    );

    if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model;
        req.flash("notice", `The ${itemName} was successfully updated.`);
        res.redirect("/inv/");
    } else {
        const classificationSelect = await utilities.buildClassificationList(classification_id);
        const itemName = `${inv_make} ${inv_model}`;
        req.flash("error", "Sorry, the update failed.");
        res.status(501).render("inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            classificationSelect: classificationSelect,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        });
    }
};

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
            const classificationSelect = await utilities.buildClassificationList();
            req.flash("notice", "New classification added successfully!");
            res.status(201).render("./inventory/management", {
                title: "Inventory Management",
                nav,
                classificationSelect
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

    // Build the classification select list
    const classificationSelect = await utilities.buildClassificationList();

    res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
        classificationSelect
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
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
    const invId = parseInt(req.params.invId)
    let nav = await utilities.getNav()
    // Get the inventory item data
    const itemData = await invModel.getInventoryByInvId(invId)
    // Build the classification select list with the current classification selected
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id
    })
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0] && invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
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