import express from 'express';
import {
  createConversationController,
  deleteConversationController,
  updateConversationController,
} from '../controllers/conversation.controller';

const router = express.Router();

router.route('/').post(createConversationController);
router
  .route('/:conversationId')
  .patch(updateConversationController)
  .delete(deleteConversationController);

export default router;
