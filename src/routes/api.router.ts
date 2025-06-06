import { Router } from "express";
import userRoutes from "./user.routes";
import teamRoutes from "./team.routes";
import memberRoutes from "./member.routes";
import taskRoutes from "./task.routes";
import joinRequestRoutes from "./joinRequest.routes";
import lookupRoutes from "./lookup.routes";

const apiRouter = Router();

apiRouter.use(userRoutes);
apiRouter.use(teamRoutes);
apiRouter.use(memberRoutes);
apiRouter.use(taskRoutes);
apiRouter.use(joinRequestRoutes);
apiRouter.use(lookupRoutes);

export default apiRouter;
