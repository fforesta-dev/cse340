const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
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

module.exports = router;