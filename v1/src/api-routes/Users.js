const validate = require('../middlewares/validate'); //validation middleware
const authenticateToken = require('../middlewares/authenticate');
const idChecker = require('../middlewares/idChecker');
const schemas = require('../validations/Users'); //validation
const express = require('express');
const userController = require('../controllers/User');

const router = express.Router();

router.get('/', userController.index);
router.route('/').post(validate(schemas.createValidation), userController.create);
router.route('/').patch(authenticateToken, validate(schemas.updateValidation), userController.update);
router.route('/login').post(validate(schemas.loginValidation), userController.login);
router.route('/projects').get(authenticateToken, userController.projectList);
router.route('/reset-password').post(validate(schemas.resetPasswordValidation), userController.resetPassword);
router.route('/change-password').post(authenticateToken,validate(schemas.changePasswordValidation),userController.changePassword);
router.route('/update-profile-image').post(authenticateToken, userController.updateProfileImage);
router.route('/:id').delete(idChecker,authenticateToken, userController.deleteUser);

module.exports = router;
