const validate = require('../middlewares/validate'); //validation
const authenticateToken = require('../middlewares/authenticate');
const idChecker = require('../middlewares/idChecker');
const schemas = require('../validations/Sections'); //validation middleware
const express = require('express');
const sectionController = require('../controllers/Section');

const router = express.Router();

router.route('/:projectId').get(idChecker("projectId"),authenticateToken, sectionController.index);
router.route('/').post(authenticateToken, validate(schemas.createValidation), sectionController.create);
router.route('/:id').patch(idChecker(),authenticateToken, validate(schemas.updateValidation), sectionController.update);
router.route('/:id').delete(idChecker(),authenticateToken, sectionController.deleteSection);
 

module.exports = router;
