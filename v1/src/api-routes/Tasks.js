const validate = require('../middlewares/validate'); //validation
const authenticateToken = require('../middlewares/authenticate');
const idChecker = require('../middlewares/idChecker');
const schemas = require('../validations/Tasks'); //validation middleware
const express = require('express');
const taskController = require('../controllers/Task');

const router = express.Router();


router.route('/').post(authenticateToken, validate(schemas.createValidation), taskController.create);
router.route('/:id').patch(idChecker,authenticateToken, validate(schemas.updateValidation), taskController.update);
router.route('/:id').delete(idChecker,authenticateToken, taskController.deleteTasks);
 
router.route('/:id/make-comment').post(idChecker,authenticateToken, validate(schemas.commentValidation), taskController.makeComment);
router.route('/:id/add-sub-task').post(idChecker,authenticateToken, validate(schemas.createValidation), taskController.addSubTask);
router.route('/:id').get(idChecker,authenticateToken,  taskController.getSubTask);

router.route('/:id/commentId').delete(idChecker,authenticateToken, validate(schemas.commentValidation), taskController.deleteComment);
module.exports = router;
