const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const { newInventoryRules, checkUpdateData } = require("../utilities/inventory-validation")
// Route to process add-inventory form (Employee/Admin only)
router.post("/add-inventory", utilities.checkLogin, utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.addInventory));
// Route to process add-classification form (Employee/Admin only)
router.post("/add-classification", utilities.checkLogin, utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.addClassification));
// Route to build add-classification view (Employee/Admin only)
router.get("/add-classification", utilities.checkLogin, utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.buildAddClassification));
// Route to build inventory management view (Employee/Admin only)
router.get("/", utilities.checkLogin, utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.buildManagement));
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to build inventory item detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));
// Route to trigger intentional error for testing
router.get("/trigger-error", utilities.handleErrors(invController.triggerError));
// Route to build add-inventory view (Employee/Admin only)
router.get("/add-inventory", utilities.checkLogin, utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.buildAddInventory));
// Route to get inventory as JSON by classification_id
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));
// Route to build the edit inventory item view (Employee/Admin only)
router.get("/edit/:invId", utilities.checkLogin, utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.buildEditInventory));
// Route to process inventory update (Employee/Admin only)
router.post(
    "/update",
    utilities.checkLogin,
    utilities.checkEmployeeOrAdmin,
    newInventoryRules(),
    checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
);
// Route to build the delete confirmation view (Employee/Admin only)
router.get("/delete/:invId", utilities.checkLogin, utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.buildDeleteInventory));
// Route to process inventory deletion (Employee/Admin only)
router.post("/delete", utilities.checkLogin, utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.deleteInventory));

module.exports = router;