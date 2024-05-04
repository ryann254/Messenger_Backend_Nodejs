import express from 'express';
const router = express.Router();

router.route('/').post(() => {});
router
  .route('/:userId')
  .patch(() => {})
  .delete(() => {});

export default router;
