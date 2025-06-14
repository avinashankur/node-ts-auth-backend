import { Router } from 'express';
import userRouter from './user.route';

const router = Router();

router.use('/users', userRouter);

export default router;
