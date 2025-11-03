import { Router } from 'express';

import auth from './auth';
import users from './users';
import doctor from './doctor';
import medcard from './medcard';
import patient from './patient';

const router = Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/doctor', doctor);
router.use('/medcard', medcard);
router.use('/patient', patient);

export default router;
