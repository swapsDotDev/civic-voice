import Invite from '../models/Invite.js';
import crypto from 'crypto';
import User from '../models/User.js';

// Create a new invite (admin only)
export const createInvite = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can create invites' });
    }
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Officer email is required' });
    }
    const code = crypto.randomBytes(8).toString('hex');
    const invite = await Invite.create({
      code,
      email,
      createdBy: req.user._id,
    });
    res.status(201).json(invite);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create invite', error: error.message });
  }
};

// List all invites (admin only)
export const listInvites = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can view invites' });
    }
    const invites = await Invite.find().populate('usedBy', 'email name').populate('createdBy', 'email name');
    res.json(invites);
  } catch (error) {
    res.status(500).json({ message: 'Failed to list invites', error: error.message });
  }
};

// Revoke (delete) an invite (admin only)
export const revokeInvite = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can revoke invites' });
    }
    const { code } = req.params;
    const invite = await Invite.findOneAndDelete({ code, used: false });
    if (!invite) {
      return res.status(404).json({ message: 'Invite not found or already used' });
    }
    res.json({ message: 'Invite revoked' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to revoke invite', error: error.message });
  }
};

// Validate and use invite during officer registration
export const useInvite = async (code, email, userId) => {
  if (!email) return { valid: false, message: 'Officer email is required' };
  const invite = await Invite.findOne({ code, used: false });
  if (!invite) return { valid: false, message: 'Invalid or used invite code' };
  if (invite.email !== email) {
    return { valid: false, message: 'Invite code is not for this email' };
  }
  invite.used = true;
  if (userId) invite.usedBy = userId;
  invite.usedAt = new Date();
  await invite.save();
  return { valid: true };
}; 