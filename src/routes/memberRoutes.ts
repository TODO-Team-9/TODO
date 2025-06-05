import express from 'express';
import { addMember, removeMember, promoteMember, getTeamMembers } from '../controllers/MemberController';

const router = express.Router();

router.post('/teams/:teamId/members', addMember);
router.delete('/teams/:teamId/members/:userId', removeMember);
router.post('/members/:memberId/promote', promoteMember);
router.get('/teams/:teamId/members', getTeamMembers);

export default router; 