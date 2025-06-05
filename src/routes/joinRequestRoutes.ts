import express from 'express';
import { createJoinRequest, updateJoinRequestStatus, getJoinRequestsForTeam } from '../controllers/JoinRequestController';

const router = express.Router();

router.post('/join-requests', createJoinRequest);
router.post('/join-requests/:requestId/status', updateJoinRequestStatus);
router.get('/teams/:teamId/join-requests', getJoinRequestsForTeam);

export default router; 