import { Router } from 'express';

import { list, show, edit, remove, create } from 'controllers/medcard';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { validatorMedcardEdit } from 'middleware/validation/medcard';
import { validatorMedcardCreate } from 'middleware/validation/medcard';

const router = Router();

router.get('/', [checkJwt, checkRole(['ADMINISTRATOR'], true)], list);
router.get('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR'], true)], show);
router.patch('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR'], true), validatorMedcardEdit], edit);
router.delete('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR'], true)], remove);
router.put('/', [checkJwt, checkRole(['ADMINISTRATOR'], true), validatorMedcardCreate], create);
export default router;