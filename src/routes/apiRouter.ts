import { Router } from 'express';
import userRoutes from './userRoutes';
import teamRoutes from './teamRoutes';
import memberRoutes from './memberRoutes';
import taskRoutes from './taskRoutes';
import joinRequestRoutes from './joinRequestRoutes';
import lookupRoutes from './lookupRoutes';

const apiRouter = Router();

apiRouter.use(userRoutes);
apiRouter.use(teamRoutes);
apiRouter.use(memberRoutes);
apiRouter.use(taskRoutes);
apiRouter.use(joinRequestRoutes);
apiRouter.use(lookupRoutes);

export default apiRouter; 