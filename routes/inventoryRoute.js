const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const { newInventoryRules, checkUpdateData } = require("../utilities/inventory-validation")
// Route to process add-inventory form
router.post("/add-inventory", utilities.handleErrors(invController.addInventory));
// Route to process add-classification form
router.post("/add-classification", utilities.handleErrors(invController.addClassification));
// Route to build add-classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
// Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildManagement));
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to build inventory item detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));
// Route to trigger intentional error for testing
router.get("/trigger-error", utilities.handleErrors(invController.triggerError));
// Route to build add-inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));
// Route to get inventory as JSON by classification_id
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));
// Route to build the edit inventory item view
router.get("/edit/:invId", utilities.handleErrors(invController.buildEditInventory));
// Route to process inventory update
router.post(
    "/update",
    newInventoryRules(),
    checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
);

module.exports = router;