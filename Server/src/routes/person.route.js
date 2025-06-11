import express from 'express';
import personController from '../controllers/person.controller.js';

const router = express.Router({ mergeParams: true });

router.get('/:person/medias', personController.personMedias);
router.get('/:person', personController.personDetail);

export default router;