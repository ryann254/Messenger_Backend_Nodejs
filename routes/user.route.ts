import express from 'express';
import {
  createUserController,
  deleteUserController,
  getUserController,
  updateUserController,
} from '../controllers/user.controller';
const router = express.Router();

router.route('/').post(createUserController);
router
  .route('/:userId')
  .get(getUserController)
  .patch(updateUserController)
  .delete(deleteUserController);

export default router;
