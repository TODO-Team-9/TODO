import express from 'express';
import { createTeam, getAllTeams, getTeamById } from '../controllers/TeamController';

const router = express.Router();

router.post('/teams', createTeam);
router.get('/teams', getAllTeams);
router.get('/teams/:id', getTeamById);

export default router; 