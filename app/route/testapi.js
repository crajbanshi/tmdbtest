import express from 'express';
import { rabbittestCtrl } from './../controllers';

const router = express.Router();
/**
 *configurator Routes
 */


router.route('/pub').post(rabbittestCtrl.publishmsg);


export default router;