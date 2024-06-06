import express from 'express';
import {
  createConversationController,
  deleteConversationController,
  getConversationController,
  updateConversationController,
} from '../controllers/conversation.controller';

const router = express.Router();

router.route('/').post(createConversationController);
router
  .route('/:conversationId')
  .get(getConversationController)
  .patch(updateConversationController)
  .delete(deleteConversationController);

export default router;
