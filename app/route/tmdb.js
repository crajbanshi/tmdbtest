import express from 'express';
import { tmdbCtrl } from './../controllers';

const router = express.Router();
/**
 *configurator Routes
 */


router.route('/topEpisodes/:id').post(tmdbCtrl.topEpisodes);

router.route('/analytics/popularSeries').post(tmdbCtrl.popularSeries);


export default router;