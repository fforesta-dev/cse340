const { body, validationResult } = require('express-validator')

// Validation rules for new classification
const newClassificationRules = () => [
    body('classification_name')
        .trim()
        .notEmpty()
        .withMessage('Classification name is required.')
        .matches(/^[A-Za-z0-9]+$/)
        .withMessage('Classification name cannot contain spaces or special characters.')
        .isLength({ min: 1 })
        .withMessage('Classification name must be at least 1 character long.')
]

// Validation rules for new and updated inventory
const newInventoryRules = () => [
    body('inv_make').trim().notEmpty().withMessage('Make is required.'),
    body('inv_model').trim().notEmpty().withMessage('Model is required.'),
    body('inv_year').trim().isInt({ min: 1900, max: 9999 }).withMessage('Year must be a 4-digit number.'),
    body('inv_description').trim().notEmpty().withMessage('Description is required.'),
    body('inv_image').trim().notEmpty().withMessage('Image path is required.'),
    body('inv_thumbnail').trim().notEmpty().withMessage('Thumbnail path is required.'),
    body('inv_price').isFloat({ min: 0 }).withMessage('Price must be a positive number.'),
    body('inv_miles').isInt({ min: 0 }).withMessage('Miles must be a non-negative number.'),
    body('inv_color').trim().notEmpty().withMessage('Color is required.'),
    body('classification_id').notEmpty().withMessage('Classification is required.')
]


// Middleware to check validation for adding inventory
async function checkInventoryData(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await require('../utilities').getNav()
        let classificationList = await require('../utilities').buildClassificationList(req.body.classification_id)
        res.render('./inventory/add-inventory', {
            title: 'Add Inventory',
            nav,
            classificationList,
            errors,
            ...req.body
        })
        return
    }
    next()
}

// Middleware to check validation for adding classification
async function checkClassificationData(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await require('../utilities').getNav()
        res.render('./inventory/add-classification', {
            title: 'Add Classification',
            nav,
            errors,
            classification_name: req.body.classification_name
        })
        return
    }
    next()
}

// Middleware to check validation for updating inventory
// If there are errors, the user is redirected back to the edit-inventory view with all form data and errors preserved.
async function checkUpdateData(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await require('../utilities').getNav()
        let classificationSelect = await require('../utilities').buildClassificationList(req.body.classification_id)
        const itemName = `${req.body.inv_make || ''} ${req.body.inv_model || ''}`
        res.render('./inventory/edit-inventory', {
            title: 'Edit ' + itemName,
            nav,
            classificationSelect,
            errors,
            inv_id: req.body.inv_id,
            inv_make: req.body.inv_make,
            inv_model: req.body.inv_model,
            inv_year: req.body.inv_year,
            inv_description: req.body.inv_description,
            inv_image: req.body.inv_image,
            inv_thumbnail: req.body.inv_thumbnail,
            inv_price: req.body.inv_price,
            inv_miles: req.body.inv_miles,
            inv_color: req.body.inv_color,
            classification_id: req.body.classification_id
        })
        return
    }
    next()
}

module.exports = { newClassificationRules, newInventoryRules, checkInventoryData, checkClassificationData, checkUpdateData }
