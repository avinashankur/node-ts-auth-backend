import { Router } from 'express';
import verifyJWT from '../middlewares/auth.middleware';
import {
  register,
  login,
  getCurrentUser,
  getAllUsers,
  logout,
  updatePassword,
  updateUser,
  searchUser,
  getUserByUsername,
} from '../controllers/user.controller';
import { refreshAccessToken } from '../controllers/auth.controller';

const router = Router();

router.route('/register').post(register);
router.route('/login').post(login);

router.route('/me').get(verifyJWT, getCurrentUser);
router.route('/all').get(verifyJWT, getAllUsers);
router.route('/update-password').put(verifyJWT, updatePassword);
router.route('/refresh-token').post(verifyJWT, refreshAccessToken);
router.route('/update').patch(verifyJWT, updateUser);
router.route('/logout').post(verifyJWT, logout);
router.route('/search-user').get(verifyJWT, searchUser);
router.route('/:username').get(getUserByUsername);

export default router;
