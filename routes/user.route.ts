import express from 'express';
import {
  createUserController,
  deleteUserController,
  updateUserController,
} from '../controllers/user.controller';
const router = express.Router();

router.route('/').post(createUserController);
router
  .route('/:userId')
  .patch(updateUserController)
  .delete(deleteUserController);

export default router;
