import { Router } from 'express';

import { list, show, edit, remove, create } from 'controllers/patient';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { validatorPatientEdit } from 'middleware/validation/patient';
import { validatorPatientCreate } from 'middleware/validation/patient';

const router = Router();

router.get('/', [checkJwt, checkRole(['ADMINISTRATOR'], true)], list);
router.get('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR'], true)], show);
router.patch('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR'], true), validatorPatientEdit], edit);
router.delete('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR'], true)], remove);
router.put('/', [checkJwt, checkRole(['ADMINISTRATOR'], true), validatorPatientCreate], create);
export default router;
