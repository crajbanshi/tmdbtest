import express from 'express';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import { serve, setup } from 'swagger-ui-express';

import swaggerConf from '../swagger/swagger'

const router = express.Router();

/** Mounting swagger services */

router.use('/swagger', serve, setup(swaggerConf));


export default router;