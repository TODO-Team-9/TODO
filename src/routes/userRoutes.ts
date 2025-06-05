import express from 'express';
import { createUser, deactivateUser, getUserById, getAllUsers } from '../controllers/UserController';

const router = express.Router();

router.post('/users', createUser);
router.post('/users/:id/deactivate', deactivateUser);
router.get('/users/:id', getUserById);
router.get('/users', getAllUsers);

export default router; 