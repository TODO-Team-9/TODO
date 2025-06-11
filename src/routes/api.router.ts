import { Router } from "express";
import userRoutes from "./user.routes";
import teamRoutes from "./team.routes";
import memberRoutes from "./member.routes";
import taskRoutes from "./task.routes";
import joinRequestRoutes from "./joinRequest.routes";
import lookupRoutes from "./lookup.routes";
import reportingRoutes from "./reporting.routes";

const apiRouter = Router();

apiRouter.use("/users", userRoutes);
apiRouter.use("/teams", teamRoutes);
apiRouter.use("/members", memberRoutes);
apiRouter.use("/tasks", taskRoutes);
apiRouter.use("/join-requests", joinRequestRoutes);
apiRouter.use("/reports", reportingRoutes);

apiRouter.use("/", lookupRoutes);

export default apiRouter;
