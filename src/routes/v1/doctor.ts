import { Router } from 'express';

import { list, show, edit, remove, create } from 'controllers/doctor';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { validatorEdit } from 'middleware/validation/users';
import { validatorCreate } from 'middleware/validation/doctors';

const router = Router();

router.get('/', [checkJwt, checkRole(['ADMINISTRATOR'], true)], list);
router.get('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR'], true)], show);
router.patch('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR'], true), validatorEdit], edit);
router.delete('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR'], true)], remove);
router.put('/', [checkJwt, checkRole(['ADMINISTRATOR'], true), validatorCreate], create);
export default router;