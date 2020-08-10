import express from 'express';
import { userCtlr, configuratorCtrl } from './../controllers';
import { validateToken } from '../helpers';
import { getUserValidate, saveUserValidate, loginValidate } from './../validation';
const router = express.Router();
/**
 *configurator Routes
 */


router.route('/saveUser').post(saveUserValidate, userCtlr.saveUser);

router.route('/login').post(loginValidate, userCtlr.login);

router.route('/getUser').post(validateToken, getUserValidate, userCtlr.getUser);
router.route('/getUsers').post(validateToken, userCtlr.getUsers);


export default router;