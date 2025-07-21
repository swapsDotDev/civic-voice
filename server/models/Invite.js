import mongoose from 'mongoose';

const inviteSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  email: { type: String }, // optional: can be used to restrict to a specific email
  used: { type: Boolean, default: false },
  usedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // admin who created
  createdAt: { type: Date, default: Date.now },
  usedAt: { type: Date },
});

const Invite = mongoose.model('Invite', inviteSchema);
export default Invite; 