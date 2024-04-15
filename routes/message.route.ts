import express from 'express';
import {
  createMessageController,
  updateMessageController,
  deleteMessageController,
} from '../controllers/message.controller';

const router = express.Router();

router.route('/').post(createMessageController);
router
  .route('/:messageId')
  .patch(updateMessageController)
  .delete(deleteMessageController);

export default router;
