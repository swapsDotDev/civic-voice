import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { submitComplaint, listComplaints, getComplaint, upload } from '../controllers/complaintController.js';

const router = express.Router();

// Submit a new complaint (citizen only)
router.post('/', authMiddleware, upload.single('image'), submitComplaint);

// List complaints (role-based)
router.get('/', authMiddleware, listComplaints);

// Get single complaint (role-based)
router.get('/:id', authMiddleware, getComplaint);

export default router;