import express from 'express';
import { tmdbCtrl, seriesCtrl } from './../controllers';

const router = express.Router();
/**
 *  Routes for topEposodes
 */


router.route('/topEpisodes/:id').get(tmdbCtrl.topEpisodes);

router.route('/analytics/popularSeries').get(seriesCtrl.popularSeries);

export default router;