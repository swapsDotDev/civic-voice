import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { createInvite, listInvites, revokeInvite } from '../controllers/inviteController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Register
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

// Officer invite endpoints (admin only)
router.post('/invites', authMiddleware, createInvite); // create invite
router.get('/invites', authMiddleware, listInvites);   // list invites
router.delete('/invites/:code', authMiddleware, revokeInvite); // revoke invite

export default router;
