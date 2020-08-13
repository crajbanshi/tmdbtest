import express from 'express';
import { tmdbCtrl } from './../controllers';

const router = express.Router();
/**
 *configurator Routes
 */


router.route('/savetmdb').get(tmdbCtrl.saveTmdb);

router.route('/topEpisodes/:id').get(tmdbCtrl.topEpisodes);

router.route('/analytics/popularSeries').get(tmdbCtrl.popularSeries1);


export default router;