import express, { Router } from 'express';
import messageRoute from './message.route';
import userRoute from './user.route';
import conversationRoute from './conversation.route';

const router = express.Router();

interface IRoute {
  path: string;
  route: Router;
}

const defaultIRoute: IRoute[] = [
  {
    path: '/message',
    route: messageRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/conversation',
    route: conversationRoute,
  },
];

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
