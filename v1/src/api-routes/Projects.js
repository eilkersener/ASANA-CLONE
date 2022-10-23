const validate = require('../middlewares/validate'); //validation
const idChecker = require('../middlewares/idChecker');
const authenticateToken = require('../middlewares/authenticate');
const schemas = require('../validations/Projects'); //validation middleware
const express = require('express');
const projectController = require('../controllers/Project');

const router = express.Router();

router.route('/').get(authenticateToken, projectController.index);
router
  .route('/')
  .post(authenticateToken, validate(schemas.createValidation), projectController.create);

router.route('/:id').patch(idChecker(),authenticateToken, validate(schemas.updateValidation), projectController.update);
router.route('/:id').delete(idChecker(),authenticateToken, projectController.deleteProject);

module.exports = router;
